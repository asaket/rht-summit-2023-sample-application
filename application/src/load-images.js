'use strict'

const log = require('barelog')
const { Observable } = require('rxjs');
const { readFileSync } = require('node:fs');
const placeholderImage = ['https://i.imgflip.com/7jval6.jpg']

/**
 * Reads the images.json file, and verifies it contains a flat array of URLs
 * @param {string} filepath
 * @returns {string[]}
 */
module.exports = function loadImages (filepath) {
  log(`loading images from ${filepath}`)

  return new Observable((subscriber) => {
    log('subscriber registered for image updates')

    // Load the initial set of images
    subscriber.next(getImagesArray(filepath))
      
    // Propagate new images once per minute (because they can change on disk)
    setInterval(() => subscriber.next(getImagesArray(filepath)), 60 * 1000);
  });
}

/**
 * Returns images from disk, or a placeholder if that fails
 * @param {string} filepath 
 * @returns Array<string>
 */
function getImagesArray (filepath) {
  try {
    log(`loading images from disk ${filepath}`)

    const images = getImagesArrayFromDisk(filepath)
    
    log(`successfully loaded images from ${filepath}: `, images)

    return images;
  } catch (e) {
    log('error fetching new images from disk:', e)
    log('using placeholder array:', placeholderImage)

    return placeholderImage
  }
}

/**
 * Returns an array of image URLs
 * @param{string} filepath
 * @returns Array<string>
 */
function getImagesArrayFromDisk (filepath) {
  const images = JSON.parse(readFileSync(filepath, 'utf-8'))

  if (!Array.isArray(images)) {
    throw new Error('Uh oh! Looks like the images.json file wasn\'t a flat array of URLs')
  }

  const errors = images
    .map((url, idx) => {
      if (typeof url !== 'string' || isValidUrl(url) === false) {
        return `Uh oh! The images.json entry at index ${idx} ("${url}") is not a valid entry. It must be a URL string, e.g "http://acme.com/some-image.jpg".`
      }
    })
    .filter((e) => e instanceof Error)

  if (errors.length !== 0) {
    throw new Error(errors.join(' '))
  }

  return images
}

/**
 * Determines if the input string is a valid URL
 * @param {string} mayBeUrl 
 * @returns Boolean
 */
function isValidUrl (mayBeUrl) {
  try {
    return new URL(mayBeUrl) ? true : false
  } catch (e) {
    return false
  }
}
