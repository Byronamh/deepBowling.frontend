import React from 'react';
import './style_home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import getPresignedUrl from "../services/getPresignedUrl";
import uploadVideoToBucket from "../services/uploadVideoToBucket";
import processVideo from "../services/rekognition";
import frameBuilderFunction from "../services/cascadingFrame"
import Loader from "../Loader";
import ReactPlayer from 'react-player'

import FFmpeg from '@ffmpeg/ffmpeg'
import FrameViewer from "../FrameViewer";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            showvideo: false,       // toggles display of video or form
            localPlayerUrl: '',     // stores the url used in the player
            s3UploadData: {         // stores data related to the s3 upload
                uploadURL: '',
                filename: ''
            },
            file: null,             // stores a ref to the selected file
            loader: {               // configs for the loader
                loading: false,
                message: 'default message'
            },
            timestampedFrames: [],  // parsed rekognition response
            playedSeconds: 0,       // last video tick
            playVideo: false,       // toggles play/pause on video
            readTimestamps: {},     // stores the timestamps that were already processed for speedup
            framesToShow: [],       // frames to paint in current tick
            prevTimestamp: 0,
            vp: {x: 0, y: 0}   // video player x,y
        }
        console.log('running project with env:', process.env)
    }

    updateLoader = (loading, message) => {
        this.setState({loader: {loading, message}});
    }

    selectFile = async () => {
        const pickerOpts = {
            types: [
                {
                    description: 'Select a video',
                    accept: {
                        'video/*': ['.mov', '.quicktime']
                    }
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false
        };
        const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

        const fileData = await fileHandle.getFile();

        this.setState({file: fileData})
        console.log('file set')
    }

    getPlayableVideoUrl = filename => `https://s3.amazonaws.com/${process.env.REACT_APP_STORAGE_BUCKET}/${filename}`

    updateVideoTick = ({playedSeconds}) => {
        const playedSecondsMs = playedSeconds * 1000;
        console.log(playedSecondsMs)
        const {cachedTimestampKeys, readTimestamps, prevTimestamp} = this.state;

        const framesToShow = cachedTimestampKeys.filter(
            timestamp => !readTimestamps[timestamp] && timestamp >= prevTimestamp && timestamp < playedSecondsMs
        );
        framesToShow.forEach(timestamp => readTimestamps[timestamp] = true);
        this.setState({prevTimestamp: playedSecondsMs, readTimestamps, framesToShow});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (!this.state.file) {
            alert('pick a file first')
            return;
        }


        this.updateLoader(true, 'Setting up the backend');
        const s3UploadData = await getPresignedUrl();
        console.info('Fetch of presigned url complete', s3UploadData);

        this.setState({s3UploadData});

        this.updateLoader(true, 'Uploading video to bucket');
        await uploadVideoToBucket(this.state.s3UploadData.uploadURL, this.state.file);

        this.updateLoader(true, 'Processing the video');

        this.setState({localPlayerUrl: this.getPlayableVideoUrl(this.state.s3UploadData.filename)})

        const {Labels, message} = await processVideo(this.state.s3UploadData.filename);
        alert(message);
        this.updateLoader(true, 'Building frames for painting');

        const timestampedFrames = frameBuilderFunction(920, 530, Labels);
        this.updateLoader(false, '');
        this.setState({
            showVideo: true,
            timestampedFrames,
            cachedTimestampKeys: Object.keys(timestampedFrames).map(k => +k)
        })

        this.updateLoader(true, 'Loading WASM modules');

        const {createFFmpeg, fetchFile} = FFmpeg;
        const ffmpeg = createFFmpeg();
        await ffmpeg.load();
        ffmpeg.FS('writeFile', this.state.s3UploadData.filename, await fetchFile(this.state.file));

        this.updateLoader(true, 'Making file compatible with browser');
        await ffmpeg.run('-i', this.state.s3UploadData.filename, 'output.mp4');
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const localPlayerUrl = URL.createObjectURL(new Blob([data.buffer], {type: 'video/mp4'}));
        this.updateLoader(false, '');

        this.setState({localPlayerUrl, playVideo: true})
    }

    render() {
        return (
            <>
                <Container className={'wholePage'}>
                    <Row className={'align-items-center justify-content-center h-100'}>
                        <Col xs={12} lg={10} className={"m-card"}>
                            {
                                !this.state.showVideo &&
                                <div>
                                    <h1>Hello Bowling Enthusiasts</h1>
                                    <form onSubmit={this.handleSubmit} className={"mt-4"}>
                                        <Row>
                                            <Col xs={12}>
                                                <button type={"button"} onClick={this.selectFile}>
                                                    Select the video file to analyze
                                                </button>
                                            </Col>
                                            <Col xs={12} className={"mt-4"}>
                                                <button type={"submit"}>Let's Go!</button>

                                            </Col>
                                        </Row>

                                    </form>
                                </div>
                            }
                            {
                                this.state.showVideo &&
                                <div className={"position-relative"}>
                                    <ReactPlayer
                                        url={this.state.localPlayerUrl}
                                        width='100%'
                                        height='100%'
                                        controls={true}
                                        onProgress={this.updateVideoTick}
                                        progressInterval={100}
                                        playing={this.state.playVideo}
                                    />
                                    <FrameViewer frames={this.state.timestampedFrames[this.state.framesToShow] || {}}/>
                                </div>
                            }

                        </Col>
                    </Row>
                </Container>
                <Loader loading={this.state.loader.loading} message={this.state.loader.message}/>
            </>
        );
    }

}

export default Home;