import React from 'react';
import './style_home.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import getPresignedUrl from "../services/getPresignedUrl";
import uploadVideoToBucket from "../services/uploadVideoToBucket";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
        this.state = {
            inputValue: '',
            videoUrl: ''
        };
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
        if (!this.state.file) {
            alert('pick a file first')
            return;
        }

        const uploadUrl = await getPresignedUrl();
        this.setState(uploadUrl);

        const reader = new FileReader();
        reader.readAsText(this.state.file);

        reader.onload = evt => {
            const binaryData = evt.target.result
            uploadVideoToBucket(this.state.uploadURL,binaryData)
            //@Todo: Implement SDK and add a loader
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