'use strict'

const { readFileSync } = require('fs')
const { join } = require('path')

/**
 * Returns a request handler that renders a HTML page containing an image.
 * @param {Observable<Array<string>>} images 
 * @returns function
 */
module.exports = function getRequestHandler(imageProvider) {
  let images = []
  const html = readFileSync(join(__dirname, 'index.html'), 'utf8')

  // Subscribe for updated image lists
  imageProvider.subscribe({
    next(newImages) {
      images = newImages
    }
  })
  
  /**
   * Handler for incoming requests
   * @param {IncomingMessage} req 
   * @param {ServerResponse} res 
   */
  return function requestHandler (req, res) {
    if (req.url !== '/') {
      res
        .writeHead(301, {
          location: '/'
        })
        .end();
    } else {
      const imageIdx = Math.round(Math.random() * (images.length - 1))
      
      res
        .setHeader('content-type', 'text/html; charset=utf-8')
        .end(html.replace('{{imageUrl}}', images[imageIdx]))
    }
  }
}