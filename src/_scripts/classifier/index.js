/*
 * Starting point of the classifying algorithm
 * Manages all underlying algorithms
 */

import { grayscale, setColorInPixelArray } from '../util/'
import { derivate } from '../util/filter'

import harris from './harris'
import descriptor from './harris-descriptor'

import kmeans from './kmeans'
import conf from './confusion-matrix'


export default function (data, cb) {

    let histograms = []

    for (const image of data.images) {

        /* Allocate memory for the gradient images */
        const gradients = {
            imageX : new Array(image.pixels.length),
            imageY : new Array(image.pixels.length),

            imageXX : new Array(image.pixels.length),
            imageXY : new Array(image.pixels.length),
            imageYY : new Array(image.pixels.length),
        }

        /* Calculate the gradient images */
        for (let y = 0; y < image.height; y++) {
            for (let x = 0; x < image.width; x++) {

                const pos = (y * image.width + x) * 4

                grayscale(image, x, y)
                const colors = derivate(image, x, y)

                setColorInPixelArray(gradients.imageX, pos, colors.X)
                setColorInPixelArray(gradients.imageY, pos, colors.Y)

                setColorInPixelArray(gradients.imageXX, pos, colors.X * colors.X)
                setColorInPixelArray(gradients.imageXY, pos, colors.X * colors.Y)
                setColorInPixelArray(gradients.imageYY, pos, colors.Y * colors.Y)
            }
        }


        /* Harris corner detection */
        const corners = harris(image, gradients)
        /* SIFT descriptor */
        const histogram = descriptor(image, corners)
        histograms = histograms.concat(histogram)

        if (typeof cb === 'function') cb(0)

    }

    /* k-means++ */
    data.clusters = kmeans.init(histograms, cb)
    /* Confusion matrix */
    return conf(data)

}
