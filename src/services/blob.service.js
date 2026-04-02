const { BlobServiceClient } = require("@azure/storage-blob");
const {
  AZURE_STORAGE_CONNECTION_STRING,
  BLOB_CONTAINER_INCOMING,
  BLOB_CONTAINER_OUTPUT,
  BLOB_CONTAINER_PAST
} = require("../config/env");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

function getContainerName(type) {
  if (type === "incoming") return BLOB_CONTAINER_INCOMING;
  if (type === "output") return BLOB_CONTAINER_OUTPUT;
  if (type === "past") return BLOB_CONTAINER_PAST;
  throw new Error("Invalid container type");
}

async function uploadToBlob(type, blobName, buffer) {
  const containerName = getContainerName(type);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  await containerClient.createIfNotExists();

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer);

  return blockBlobClient.url;
}

async function listBlobs(type) {
  const containerName = getContainerName(type);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobs = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(blob.name);
  }
  return blobs;
}

async function downloadBlob(type, blobName) {
  const containerName = getContainerName(type);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobClient = containerClient.getBlobClient(blobName);
  const downloadResponse = await blobClient.download();
  const downloaded = await streamToBuffer(downloadResponse.readableStreamBody);
  return downloaded;
}

function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => chunks.push(data instanceof Buffer ? data : Buffer.from(data)));
    readableStream.on("end", () => resolve(Buffer.concat(chunks)));
    readableStream.on("error", reject);
  });
}

module.exports = {
  uploadToBlob,
  listBlobs,
  downloadBlob
};