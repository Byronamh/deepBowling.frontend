import {
    RekognitionClient,
    DetectLabelsCommand,
    DetectCustomLabelsCommand,
    StartProjectVersionCommand,
    StopProjectVersionCommand
} from "@aws-sdk/client-rekognition";
const config = {
    region: process.env.REACT_APP_AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
}
let useCustomLabels = true;

const rekognitionClient = new RekognitionClient(config);

const processFrame = async imageData => {

    const configs = {
        Image: {Bytes: imageData},
        ProjectVersionArn: process.env.REACT_APP_AWS_MODEL_ARN,
        MinConfidence: 80
    };
    let imageProcessReq = new DetectCustomLabelsCommand(configs);
    if (!useCustomLabels) {
        imageProcessReq = new DetectLabelsCommand(configs);
    }

    return rekognitionClient.send(imageProcessReq);
}

window.startSession = async () => {
    const initProjectCmd = new StartProjectVersionCommand({
        MinInferenceUnits: 1,
        ProjectVersionArn: process.env.REACT_APP_AWS_MODEL_ARN
    });
    await rekognitionClient.send(initProjectCmd)
}

window.endSession = async () => {
    const endProjectCmd = new StopProjectVersionCommand ({
        ProjectVersionArn: process.env.REACT_APP_AWS_MODEL_ARN
    });
    await rekognitionClient.send(endProjectCmd)
}
const processFrames = async (frames, clientUseCustomLabels = true) => {
    useCustomLabels = clientUseCustomLabels

    const returnableFrames = {};
    while (frames.length) {
        const [timestamp, frameData] = frames.shift();
        returnableFrames[timestamp] = (await processFrame(frameData))[useCustomLabels ? 'CustomLabels' : 'Labels'];
    }
    return returnableFrames
}


export default processFrames;