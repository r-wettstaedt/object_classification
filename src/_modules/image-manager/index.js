/*
 * Handles the display of the uploaded images and controls
 * the classifying algorithm
 */

import $ from 'jquery'
import progress from '../progress'

import classifier from '../../_scripts/classifier'

export default {

    /*
     * Initializes this module's DOM elements and fields, and registers events
     */
    init : function () {
        this.className = 'images'
        this.$el = $(`.${this.className}`)
        this.$stats = $(`.${this.className}__stats`)
        this.$conf = $(`.${this.className}__confusion`)

        this.images = []
        this.poi = []

        this.compareImage = {}

        this.streamEnded = false

        /* Starting a new background thread (WebWorker) */
        const work = require('webworkify')
        this.worker = work(require('./worker.js'))

        this.registerEvents()

        return this
    },

    /*
     * Proxies events to the specified functions
     */
    registerEvents : function () {
        this.worker.addEventListener('message', this.workerMsg.bind(this))
    },

    /*
     * Is fired when the background thread sends data
     * to the main thread
     */
    workerMsg : function (event) {
        const percent = progress.tick()

        switch (event.data) {
            case 0:
                /* An image has been processed */
                if (percent >= 100) progress.do(200, 'Clusters initialized..')
                break

            case 1:
                /* A cluster centre has been initialized */
                if (percent >= 100) progress.do(0, 'Refining clusters..')
                break

            case 2:
                /* Refining the cluster centres has been completed */
                if (percent >= 100) progress.do(0, 'Building confusion matrix..')
                break

            default: 
                /* The classifier is done and sends the confusion matrix and statistical data */
                progress.hide()
                this.$conf[0].width = event.data.image.width
                this.$conf[0].height = event.data.image.height
                const ctx = this.$conf[0].getContext('2d')
                ctx.putImageData(event.data.image, 0, 0)

                const $stats = this.createStats(event.data.stats)
                this.$stats.append($stats)

                this.$el.addClass(`${this.className}--transition`)
                this.$stats.addClass(`${this.className}__stats--transition`)

                break
        }

    },

    /*
     * Used by the FileManager to pass in the read files
     * 
     * Takes the images as base64 encoded strings and places them
     * as Image DOM elements into the DOM
     * 
     * When all images have been loaded up, it sends a message to the
     * background thread, telling it to start classifying
     */
    addImages : function (objects, length) {
        this.objects = objects
        for (const key in objects) {
            const $list = this.createList(key)

            for (const src of objects[key]) {
                this.createImage(src).then($img => {
                    $list.append($img)

                    this.images.push({
                        width : $img[0].width,
                        height : $img[0].height,
                        src : src,

                        pixels : this.getPixels($img[0]),
                        class : key,
                        index : this.images.length,
                    })

                    if (this.images.length === length) {
                        this.objects.length = Object.keys(this.objects).length
                        this.$rows = $(`.${this.className}__row`)

                        // classifier({
                        this.worker.postMessage({
                            images : this.images,
                            objects : this.objects,
                        })
                    }
                })

            }

            this.$el.append($list)
        }
    },

    /*
     * Create a DOM list
     */
    createList : function (name) {
        return $(`
            <div class="row ${this.className}__row ${this.className}__row--${name}">
                <h2 class="${this.className}__header col-xs-12">${name}</h2>
            </div>
        `)
    },

    /*
     * Create a DOM image and return when the image has been loaded up
     */
    createImage : function (src) {
        return new Promise(resolve => {
            const $img = $(`
                <img
                    class="col-xs-6 col-sm-4 col-md-3 col-lg-2"
                    src="${src}"
                >
            `)

            $img[0].onload = () => resolve($img)
        })
    },

    /*
     * Create a DOM element, showing statistical stuff
     */
    createStats : function (stats) {
        const str = []
        for (const stat in stats) {
            str.push(`<dt>${stats[stat].desc}</dt>`)
            str.push(`<dd>${stats[stat].value}</dd>`)
        }
        return $(`
            <dl class='col-xs-6'>
                ${str.join('')}
            </dl>
        `)
    },

    /*
     * Load the image into a HTML5 canvas and return the pixel array
     */
    getPixels : function (image) {
        const canvas = $('<canvas>')[0]
        canvas.width = image.width
        canvas.height = image.height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        return ctx.getImageData(0, 0, image.width, image.height).data
    },

}
