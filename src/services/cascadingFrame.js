const configs = {
    canvasWidth: 0,
    canvasHeight: 0,
    ready: false
}

// Set max frame sizes
const setConfigs = (canvasWidth, canvasHeight) => {
    configs.canvasWidth = canvasWidth;
    configs.canvasHeight = canvasHeight;
}

// Parses the data sent by rekognition, transforms it into pixels based on canvas size.
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

// parsed entities
const entities = {};

// Parses the response from rekognition, returns the entities object with the following structure:
// <number> timestamp: { <string>"Label":[<box><box>],...}
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

// Exposed module function
const outFn = (canvasWidth, canvasHeight) => {
    setConfigs(canvasWidth, canvasHeight);
    return (frames) => {
        buildFrames(frames);
        return entities
    };

}
export default outFn;