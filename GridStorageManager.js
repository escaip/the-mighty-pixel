const azure = require('azure-storage'),
//const azure = require('azure'),
confAB = require('./config').azureBlob

class GridStorageManager {
  constructor(errorCallback, createdCallback) {
    this.errorCallback = errorCallback
    this.createdCallback = createdCallback
    this.blobService = azure.createBlobService(confAB.connectionString)
    this.isContainerCreated = false
    this.isNew = true

    this.blobService.createContainerIfNotExists(confAB.blobContainerName,
      (error, result, response) => {
      if (error) { this.errorCallback(error) }
      else {
        this.isContainerCreated = true
        this.isNew = result.created
        this.createdCallback(result)
      }
    })
  }

  upload(gridMap, gridMetadata) {
    if (!this.isContainerCreated) return

    const mapToJSON = (map) => { return JSON.stringify([...map]) }

    let gridMapJSON = mapToJSON(gridMap)
    let gridMetadataJSON = JSON.stringify(gridMetadata)

    this.blobService.createBlockBlobFromText(confAB.blobContainerName,
      confAB.gridMapBlobName, gridMapJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap uploaded */ }
    })

    this.blobService.createBlockBlobFromText(confAB.blobContainerName,
      confAB.gridMetadataBlobName, gridMetadataJSON, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMetadata uploaded */ }
    })
  }

  download() {
    if (!this.isContainerCreated) return

    const JSONToMap = (str) => { return new Map(JSON.parse(str)) }

    this.blobService.getBlobToText(confAB.blobContainerName,
      confAB.gridMapBlobName, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else {
        //TODO: figure out how to get JSON
        console.log(result)
      }
    })

    this.blobService.getBlobToText(confAB.blobContainerName,
      confAB.gridMetadataBlobName, (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else {
        //TODO: figure out how to get JSON
        console.log(result)
      }
    })

    let grid = new Map()
    let config = {}
    //TODO: construct a Grid object from JSON strings
    return [grid, config]
  }

  delete() {
    if (!this.isContainerCreated) return

    this.blobService.deleteContainerIfExists(confAB.blobContainerName,
      (error, result, response) => {
      if(error) { this.errorCallback(error) }
      else { /* gridMap deleted */ }
    })
  }
}


module.exports = GridStorageManager
