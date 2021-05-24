const uploadVideoToBucket = async (uploadUrl, binaryVideoData) => {
    const configs = {
        method: 'PUT',
        body: binaryVideoData,
        headers: {
            "Content-Type": "video/quicktime"
        }
    };
    await fetch(uploadUrl, configs);
}

export default uploadVideoToBucket


