const configs = {
    canvasWidth: 0,
    canvasHeight: 0,
    ready: false
}
const setConfigs = (canvasWidth, canvasHeight) => {
    configs.canvasWidth = canvasWidth;
    configs.canvasHeight = canvasHeight;
    configs.ready = true;
}
const buildBox = ({Height, Left, Top, Width}) => {
    const computedHeight = (Height * configs.canvasHeight).toFixed(2);
    const computedWidth = (Width * configs.canvasWidth).toFixed(2);
    const LeftPadding = (Left * configs.canvasWidth).toFixed(2);
    const topPadding = (Top * configs.canvasHeight).toFixed(2);

    return {computedHeight, computedWidth, LeftPadding, topPadding};
}

const entities = {};

const buildFrames = ({Label, Timestamp}) => {
    const {Instances, Name, Confidence} = Label;
    const boxes = Instances.map(({BoundingBox}) => buildBox(BoundingBox))

    if (!boxes.length) {
        return;
    }

    if (entities[Timestamp] === undefined) {
        entities[Timestamp] = {};
    }
    entities[Timestamp][Name] = [boxes, Confidence];
}

//used for testing
window.buildFrames = (canvasHeight, canvasWidth, labelArray) => {
    setConfigs(canvasHeight, canvasWidth);
    labelArray.forEach(buildFrames);
    console.log(entities)
    return entities
}

export default (canvasHeight, canvasWidth, labelArray) => {
    setConfigs(canvasHeight, canvasWidth);
    labelArray.forEach(buildFrames);

    return entities
}