'use strict'

const log = require('barelog')
const http = require('http')

// Load configuration from environment variables
const {
  HTTP_HOST,
  HTTP_PORT,
  IMAGES_JSON_FILEPATH
} = require('./config')(process.env)

// Load variables from the given file path
const images = require('./load-images')(IMAGES_JSON_FILEPATH)

// Create a request handler that will return a random image
const requestHandler = require('./request-handler')(images)

// Create and start the HTTP server with our request handler
const server = http
  .createServer(requestHandler)
  .listen(HTTP_PORT, HTTP_HOST, () => {
    log(`server listening on ${HTTP_HOST}:${HTTP_PORT} 🚀`)
  });

// Handle shutdown signals
['SIGINT', 'SIGTERM'].forEach((sig) => {
  process.on(sig, () => {
    log(`received signal ${sig}. shutting down http server and process`)
  
    server.close((err) => {
      if (err) {
        log('error shutting down http server. exiting with code 1:', err)
        process.exit(1)
      } else {
        log('successfully shutdown http server. exiting with code 0')
        process.exit(0)
      }
    })
  })
})