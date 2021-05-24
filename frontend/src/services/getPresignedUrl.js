const SERVICE_URL = process.env.SERVICE_URL || 'https://3s0mgxr4al.execute-api.us-east-1.amazonaws.com/';

const getPresignedUrl = async () => {

    const call = fetch(SERVICE_URL).then(res => res.json())

    const {uploadURL, filename} = await call;
    return {uploadURL, filename};
}

export default getPresignedUrl;