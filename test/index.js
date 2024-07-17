'use strict'

const test = require('node:test')
const yaml = require('yamljs')
const assert = require('assert')
const { join } = require('path')
const { existsSync } = require('fs')

const cms = [
  'k8s/base/config-map.yaml',
  'k8s/overlays/development/config-map.yaml',
  'k8s/overlays/production/config-map.yaml'
]

cms.forEach((path) => {
  test(`Image URLs in ConfigMap (${path}) resolve to 200 OK responses with image content-type`, (t) => {
    return t.test(`Testing path ${path}`, (t) => {
      const fullpath = join(__dirname, '..', path)
      
      if (!existsSync(fullpath)) {
        // Skip the test if an environment doesn't define custom images
        return Promise.resolve()
      }

      const { data } = yaml.load(fullpath)
      const images = JSON.parse(data['images.json'])


      const fetchies = images.map((url) => {
        return t.test(`URL: ${url}`, () => {
          return fetch(url).then(res => {
            const statusCode = res.status
            const contentType = res.headers.get('content-type')

            assert(
              statusCode === 200,
              `Expected 200 OK but received ${res.status}`
            )
            
            assert(
              contentType.includes('image'),
              `Expected content-type header to contain "image", but it was ${contentType}`
            )
          })
        })
      })

      return Promise.all(fetchies)
    })
  })
})