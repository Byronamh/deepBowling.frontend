import "./styles.css";
import React from 'react';

let cache=[];
class FrameViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            entityCache: {}
        }
    }

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
    parseFrames = frames => {
        const entitiesInFrame = Object.keys(frames);
        const returnable = entitiesInFrame.map(
            Label => {
                const [boxesConfig, Confidence] = frames[Label];
                return boxesConfig.map((bc, i) => this.drawBox(bc, {Label, Confidence}, i))
            }
        )
        const oldCache = cache;
        cache = [...returnable]
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