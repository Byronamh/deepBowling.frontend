const configs = {
    canvasWidth: 0,
    canvasHeight: 0,
    ready: false
}
const setConfigs = (canvasWidth, canvasHeight) => {
    configs.canvasWidth = canvasWidth;
    configs.canvasHeight = canvasHeight;
}
const buildBox = (
    {
        Height = 1,
        Left = 0,
        Top = 0,
        Width = 1
    }) => {
    const computedHeight = (Height * configs.canvasHeight).toFixed(2);
    const computedWidth = (Width * configs.canvasWidth).toFixed(2);
    const LeftPadding = (Left * configs.canvasWidth).toFixed(2);
    const topPadding = (Top * configs.canvasHeight).toFixed(2);

    return {computedHeight, computedWidth, LeftPadding, topPadding};
}

const entities = {};

const buildFrames = (frames) => {
    const timestamps = Object.keys(frames);
    timestamps.forEach(timestamp => {
        const labelsInEpoch = frames[timestamp];
        labelsInEpoch.forEach((data) => {
            const {Confidence, Instances = [], Name, Geometry = {}} = data
            const boxes = Instances.map(data => buildBox(data))
            if (Geometry) {
                const {BoundingBox} = Geometry;
                boxes.push(buildBox(BoundingBox))
            }
            if (!boxes.length) {
                boxes.push(buildBox({}));
            }

            if (entities[timestamp] === undefined) {
                entities[timestamp] = {};
            }
            entities[timestamp][Name] = [boxes, Confidence];

        })

    })

}


export default (canvasWidth, canvasHeight) => {
    setConfigs(canvasWidth, canvasHeight);
    return (frames) => {
        buildFrames(frames);
        return entities
    };

}