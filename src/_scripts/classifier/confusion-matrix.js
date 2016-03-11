/*
 * Iterates over all images and setting it as the new 'wildcard image',
 * that is compared to the existing clusters, trying to find out which 
 * image class it belongs to
 * 
 * Generates the confusion matrix and statistical measurements
 */

import { setColorInPixelArray } from '../util/'
import descriptor from './kmeans-descriptor'

const conf = {

    /*
     * Initializes this fields and starts clustering
     */
    init : function (data) {
        this.data = data

        this.wildcardClass = '?'
        this.max = 0
        this.correct = 0
        this.errors = 0

        this.initMatrix()
        this.classifyImages()
        this.createConfusionMatrix()

        return {
            image : new ImageData(this.pixels, this.data.objects.length, this.data.objects.length),
            stats : {
                correct : {
                    desc : 'Overall correct rate',
                    value : this.correct,
                },
                error : { 
                    desc : 'Overall error rate',
                    value : this.errors,
                },
            },
        }
    },

    /*
     * Creates the confusion matrix in object form
     */
    initMatrix : function () {
        for (const key in this.data.objects) {
            if (key === 'length') continue

            this.data.objects[key] = {}

            for (const _key in this.data.objects) {
                if (_key === 'length') continue
                this.data.objects[key][_key] = 0
            }
        }
    },

    /*
     * Classifies each image and measures stats
     */
    classifyImages : function () {
        for (const image of this.data.images) {
            const result = descriptor(this.data, image)
            const object = this.data.objects[image.class]

            object[result.bestKey] += 50

            if (image.class === result.bestKey) this.correct++
            else this.errors++

            if (object[result.bestKey] > this.max)
                this.max = object[result.bestKey]
        }
    },

    /*
     * Creates the confusion matrix as a HTML5-canvas-ready
     * pixel array
     */
    createConfusionMatrix : function () {
        this.pixels = new Uint8ClampedArray(Math.pow(this.data.objects.length, 2) * 4)
        const keys = Object.keys(this.data.objects).filter(key => key !== 'length' && key !== this.wildcardClass)

        for (let y = 0; y < keys.length; y++) {
            const key = keys[y]

            for (let x = 0; x < keys.length; x++) {
                const _key = keys[x]

                const pos = (y * keys.length + x) * 4
                const color = this.data.objects[key][_key]
                setColorInPixelArray(this.pixels, pos, color)

            }
        }

    },

}


export default conf.init.bind(conf)