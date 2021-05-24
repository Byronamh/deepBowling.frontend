const uploadVideoToBucket = async (uploadUrl, binaryVideoData) => {
    const configs = {
        method: 'PUT',
        body: binaryVideoData,
        headers:{
            "Content-Type":"video/quicktime"
        }
    };
    const req = await fetch(uploadUrl, configs);
    return req.json();
}

export default uploadVideoToBucket


