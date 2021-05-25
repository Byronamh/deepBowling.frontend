# Deepbowling

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

---
## Getting started

Run `npm install` to install dependencies.

Aditionally, you must have `env-cmd` installed gobally (`npm i -g env-cmd`)

Run `npm start` to start the app in dev mode. Open [http://localhost:3000](http://localhost:3000) to view it in the
browser.

## IAM role configuration

```
@Todo: Describe necessary roles.
```

## Env file

Add a .env file to the root directory of this project, it must have this shape:

```
REACT_APP_AWS_REGION = <your region>
REACT_APP_AWS_ACCESS_KEY_ID = <your user access key>
REACT_APP_AWS_SECRET_ACCESS_KEY = <your user secret access key>
REACT_APP_AWS_MODEL_ARN = <the ARN for your trained model (optional)
```

## In console commands

Several helper functions were added to aid and make execution more efficient.

These functions are available in the `window` scope.


### `startSession = () => void`
You **must** call this function if you want to use custom labeling. From experience, call this functin 20 mins before you *need* the model.

### `endSession = () => void`
After you finish working with custom label modeling, turn of the model so it doesnt over-charge you account.

### `useCustomLabels = true`
When `window.useCustomLabels` is set to `true` the rekognition sdk will use `DetectLabelsCommand` instead of `DetectCustomLabelsCommand`.

### `frameBuffering = true`

When `window.frameBuffering` is set to `true`, when the video is being played the current and last frames will be
renedred on screen. When it's not, only the current frames will be rendered.

### `getFrames = () => frames`

This function returns the timestamped frame object. You can store this somewhere (for example clipboard or another file)
to load the frames later on with `window.loadFramesFromMem(frames)`

### `loadFramesFromMem = frames => void`

This function sets the timestamped frame object to whatever is sent as an argument.

### `skipCapture = () => void`

This function signals the app to skip the frame capturing process. This means that it will not capture frames from the
video nor send them to Rekognition for processing.

### `toggleVideoExecution = () => void`
This function pauses/resumes the execution of the video. This can also pause during frame analysis and frame display

### `replay = () => void`
Restarts the video duration and starts play

### loadFramesFromMem(frames)

This function sets the timestamped frame object to whatever is sent as an argument.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved
here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved
here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved
here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved
here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved
here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved
here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
