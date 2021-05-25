import {RekognitionClient, StartLabelDetectionCommand, GetLabelDetectionCommand} from "@aws-sdk/client-rekognition"; // ES Modules import
const MAX_WAIT_ITERATIONS = 8;
const BUCKET_KEY = process.env.REACT_APP_STORAGE_BUCKET || 'storage.deepbowling';
const config = {
    region: process.env.REACT_APP_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
}
const rekognitionClient = new RekognitionClient(config);

const getJobStatus = async JobId => {
    const getVideoLabelsRequest = new GetLabelDetectionCommand({JobId});

    const videoLabelsResponse = await rekognitionClient.send(getVideoLabelsRequest);
    const {JobStatus, Labels, StatusMessage} = videoLabelsResponse;
    return {JobStatus, Labels, StatusMessage}
}
window.getJobStatus = getJobStatus;

const processVideo = async filename => {
    const returnable = {
        Labels: [],
        message: ''
    }
    // const videoProcessJobRequest = new StartLabelDetectionCommand({
    //         Video: {
    //             S3Object: {
    //                 Bucket: BUCKET_KEY,
    //                 Name: filename
    //             }
    //         },
    //         MinConfidence: 80
    //     }
    // );
    // console.info('Starting rekognition task')
    // const {JobId} = await rekognitionClient.send(videoProcessJobRequest);
    // console.info(`Rekognition task started with JobId: ${JobId}`)
    const getVideoLabelsRequest = new GetLabelDetectionCommand({JobId:'354968ae604cdad9030e5d13bf32d6ff46112711351ed41db7d8fde4b5e731cb'});

    console.info('Waiting for job to complete')
    let ct = 0;
    while (1) {
        ct++;
        const videoLabelsResponse = await rekognitionClient.send(getVideoLabelsRequest);
        const {JobStatus, Labels, StatusMessage} = videoLabelsResponse;

        console.info(`Checked on job status, current status is: ${JobStatus}`)
        if (ct === MAX_WAIT_ITERATIONS) {
            console.warn('MAX NUMBER OF WAIT TIME REACHED, TRY AGAIN?')
            returnable.message = 'Reached max amount of wait time';
            break;
        }
        if (JobStatus === "IN_PROGRESS") {
            await delay(10)
        }
        if (JobStatus === 'SUCCEEDED') {
            returnable.Labels = Labels;
            returnable.message = 'Analisis complete'
            break;
        }
        if (JobStatus === 'FAILED') {

            returnable.Labels = Labels;
            returnable.message = StatusMessage
            break;
        }
    }
    return returnable;
}
window.processVideo = processVideo;

const delay = (n) => new Promise(resolve => setTimeout(resolve, n * 1000));//Don't do this in production. Instead sub to SNS topic


export default processVideo;