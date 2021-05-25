export default async (blobString) => {
    const blob = blobString.split("data:image/png;base64,");
    const data = await fetch(blob);
    const buf = await data.arrayBuffer()
    return new Uint8Array(buf)
}