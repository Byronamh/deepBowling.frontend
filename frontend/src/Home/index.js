import React from 'react';
import './style_home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import getPresignedUrl from "../services/getPresignedUrl";
import uploadVideoToBucket from "../services/uploadVideoToBucket";
import processVideo from "../services/rekognition";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {}
        console.log('running project with env:', process.env)
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

    handleSubmit = async (event) => {
        event.preventDefault();
        console.log(this.state)
        if (!this.state.file) {
            alert('pick a file first')
            return;
        }

        //@Todo: add loader for "getting things ready"
        console.info('Fetching presigned url...')
        const s3UploadData = await getPresignedUrl();
        console.info('Fetch of presigned url complete', s3UploadData)
        //@Todo: remove loader for "getting things ready"
        this.setState({s3UploadData});

        const reader = new FileReader();
        reader.readAsText(this.state.file);
        console.info('Converting file to binary...')
        reader.onload = async evt => {
            console.info('File converted to binary')
            const binaryData = evt.target.result
            //@Todo: add loader for video upload
            console.info(`Uploading file to: ${this.state.s3UploadData.uploadURL}`)
            await uploadVideoToBucket(this.state.s3UploadData.uploadURL, binaryData);
            console.info('File upload complete')
            //@Todo: remove loader for video upload
            //@Todo: add loader for video processing
            console.info('Video processing started')
            const videoLabels = await processVideo(this.state.s3UploadData.filename)
            console.info('Video processing ended, with yield: ', videoLabels)
            //@Todo: remove loader for video processing
        };
    }

    render() {
        return (
            <Container className={'wholePage'}>
                <Row className={'align-items-center justify-content-center'}>
                    <Col xs={12} lg={6}>
                        <h1>Hello Bowling Enthusiasts</h1>

                        <form onSubmit={this.handleSubmit}>
                            <button type={"button"} onClick={this.selectFile}>Select the video file to analyze</button>

                            <br/> <br/>
                            <button type={"submit"}>Let's Go!</button>
                        </form>
                    </Col>
                </Row>
            </Container>
        );
    }

}

export default Home;