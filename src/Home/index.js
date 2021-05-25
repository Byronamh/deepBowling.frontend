import React from 'react';
import './style_home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import processFrames from "../services/rekognition";
import frameBuilderFunction from "../services/cascadingFrame"
import Loader from "../Loader";
import ReactPlayer from 'react-player'

import FrameViewer from "../FrameViewer";
import captureFrame from "../utils/captureFrame";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        window.frameBuffering = true;
        this.state = {
            showvideo: false,       // Toggles display of video or form
            localPlayerUrl: '',     // Stores the url used in the player
            file: null,             // Stores a ref to the selected file
            loader: {               // Configs for the loader
                loading: false,
                message: 'default message'
            },
            timestampedFrames: [],  // Parsed rekognition response
            playedSeconds: 0,       // Last video tick
            playVideo: false,       // Toggles play/pause on video
            readTimestamps: {},     // Stores the timestamps that were already processed for speedup
            framesToShow: [],       // Frames to paint in current tick
            prevTimestamp: 0,       // Last frame tick time in ms
            capture: true,          // When true, the capture process will happen, taking frames of the video and sending them to rekognition
            framePictureArray: [],  // Array of timestamped frames
        }

        window.getFrames = () => this.state.timestampedFrames; //you might want to save the parsed frames after an expensive operation
        window.loadFramesFromMem = this.loadFramesFromMem;// load frames via console
        window.skipCapture = this.skipCapture; // skip capture/load process
        window.toggleVideoExecution = this.toggleVideoExecution // pause/play via command
        window.useCustomLabels = true; // use DetectCustomLabels or DetectLabels in rekognition.
        console.log('running project with env:', process.env)

    }

    //Play/pause video
    toggleVideoExecution = () => this.setState({playVideo: !this.state.playVideo});

    //Loads frames into memory
    loadFramesFromMem = timestampedFrames => this.setState({timestampedFrames});

    //Skips the capture process
    skipCapture = () => this.setState({capture: false});

    //Update the loaders props you can set loading to false to hide it
    updateLoader = (loading, message) => {
        this.setState({loader: {loading, message}});
    }

    //Select file from device explorer.
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

    // Handle form submit
    handleSubmit = async (event) => {
        event.preventDefault();
        if (!this.state.file) {
            alert('pick a file first')
            return;
        }
        this.updateLoader(true, 'Processing the video');

        this.setState({
            showVideo: true,
            playVideo: true,
            localPlayerUrl: URL.createObjectURL(this.state.file)
        });
    }

    // When video does a tick, update the frames to show
    updateVideoTick = ({playedSeconds}) => {
        const playedSecondsMs = playedSeconds * 1000;
        const {cachedTimestampKeys, readTimestamps, prevTimestamp} = this.state;

        const framesToShow = cachedTimestampKeys.filter(
            timestamp => !readTimestamps[timestamp] && timestamp >= prevTimestamp && timestamp < playedSecondsMs
        );
        framesToShow.forEach(timestamp => readTimestamps[timestamp] = true);
        this.setState({prevTimestamp: playedSecondsMs, readTimestamps, framesToShow});
    }

    // When the video does a tick, route what action happens, either capture frames or show entities
    videoOnProgress = ({playedSeconds}) => {
        if (this.state.capture) {
            const frame = captureFrame(this.player.wrapper.firstChild);
            this.state.framePictureArray.push([Math.floor(playedSeconds * 1000), frame]);
        } else {
            this.updateVideoTick({playedSeconds})
        }
    }

    // When the video ends, explose helper functions and if capture was enabled, send images to Rekognition
    videoOnEnd = async () => {
        window.replay = () => {
            this.player.wrapper.firstChild.currentTime = 0
            this.setState({readTimestamps: [], prevTimestamp: 0})
        }

        this.frameBuilder = frameBuilderFunction(this.player.wrapper.clientWidth, this.player.wrapper.clientHeight);
        if (this.state.capture) {
            this.updateLoader(true, 'Sending frames for processing');

            const rawTimestampedFrames = await processFrames(this.state.framePictureArray, window.useCustomLabels || true)
            this.updateLoader(true, 'Building View Boxes');
            const timestampedFrames = this.frameBuilder(rawTimestampedFrames);
            this.setState({
                cachedTimestampKeys: Object.keys(timestampedFrames).map(k => +k),
                timestampedFrames,
                capture: false,
                playVideo: true
            });
            this.updateLoader(false, '');
            this.player.wrapper.firstChild.currentTime = 0
        }
    }

    // Gets the players data
    getVideoRef = player => {
        this.player = player
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
                                        ref={this.getVideoRef}
                                        url={this.state.localPlayerUrl}
                                        width='100%'
                                        height='100%'
                                        controls={true}
                                        onProgress={this.videoOnProgress}
                                        progressInterval={120}
                                        playing={this.state.playVideo}
                                        onEnded={this.videoOnEnd}
                                    />
                                    <FrameViewer
                                        frames={this.state.timestampedFrames[this.state.framesToShow] || {}}/>
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