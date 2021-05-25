//based on `capture-video-frame`, but optimized for my needs
const canvas = document.createElement("CANVAS");

export default (video) => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUri = canvas.toDataURL('image/jpeg', 0.92);
    const data = dataUri.split(',')[1];

    const bytes = window.atob(data);
    const buf = new ArrayBuffer(bytes.length);
    const arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++) {
        arr[i] = bytes.charCodeAt(i);
    }
    return arr;
}