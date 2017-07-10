module.exports = {
  grid: {
    rows: 256,
    cols: 384,
    initColor: 15
  },

  server: {
    port: process.env.port || process.env.PORT || 1337
  },

  azureBlob: {
    connectionString: 'local',
    blobContainerName: 'grid-container',
    gridMapBlobName: 'grid-map',
    gridMetadataBlobName: 'grid-metadata'
  }
}