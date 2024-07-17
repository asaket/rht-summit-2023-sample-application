'use strict'

const { from } = require('env-var')
const { join } = require('path')

const DEFAULT_IMAGES_FILE_PATH = join(__dirname, 'images.json')

module.exports = function loadEnv (env) {
  const { get } = from(env)

  return {
    HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
    HTTP_HOST: get('HTTP_HOST').default('0.0.0.0').asString(),

    IMAGES_JSON_FILEPATH: get('IMAGES_JSON_FILEPATH').default(DEFAULT_IMAGES_FILE_PATH).asString()
  }
}