import "./styles.css";
import React from 'react';

class FrameViewer extends React.Component {
    constructor(props) {
        super(props);
    }
    drawBox = frameInfo =>{
        return(
            <div>

            </div>
        )
    }
    render() {
        return (
            <div className={"frame-viewer-outer"}>
                <div className={"frame-viewer-inner"}>

                </div>
            </div>
        )
    }
}

export default FrameViewer;