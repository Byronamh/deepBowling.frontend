const uploadVideoToBucket = async (uploadUrl, binaryVideoData) => {
    const configs = {
        method: 'PUT',
        body: binaryVideoData,
        headers: {
            'Content-Type': 'video/mov'
        }
    };
    const req = await fetch(uploadUrl, configs);
    return req.json();
}

export default uploadVideoToBucket


