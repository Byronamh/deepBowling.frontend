import "./styles.css";
import React from 'react';

class FrameViewer extends React.Component {
    constructor(props) {
        super(props);

        this.cache = []
    }

    // Returns a box DOMElement, with positional styles
    drawBox = ({computedHeight, computedWidth, LeftPadding, topPadding}, {Label, Confidence}, key) => {
        return (
            <div
                key={key}
                className={"frame-box"}
                style={{
                    height: computedHeight + 'px',
                    width: computedWidth + 'px',
                    left: LeftPadding + 'px',
                    top: topPadding + 'px'
                }}>
                <div className="frame-box-inner">

                    <div className="frame-label">{Label}</div>
                    <div className="frame-confidence">{Confidence}</div>
                </div>
            </div>
        )
    }

    // Converts frames into Elements
    parseFrames = frames => {
        const entitiesInFrame = Object.keys(frames);
        const returnable = entitiesInFrame.map(
            Label => {
                const [boxesConfig, Confidence] = frames[Label];
                return boxesConfig.map((bc, i) => this.drawBox(bc, {Label, Confidence}, i))
            }
        )
        // By default it will also show the past frame's labels, you can disable this by setting `window.frameBuffering` to false
        const oldCache = window.frameBuffering ? this.cache : [];
        this.cache = [...returnable];

        return [...returnable, ...oldCache]
    }

    render() {
        return (
            <div className={"frame-viewer-outer"}>
                <div className={"frame-viewer-inner"}>
                    {this.parseFrames(this.props.frames)}
                </div>
            </div>
        )
    }
}

export default FrameViewer;