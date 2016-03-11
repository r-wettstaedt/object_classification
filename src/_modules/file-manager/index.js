/*
 * Handles the upload of an image directory
 * and passes the read files to the ImageManager
 */

import $ from 'jquery'
import progress from '../progress'
import imageManager from '../image-manager'

export default {

    /*
     * Initializes this module's DOM elements and registers events
     */
    init : function () {
        this.$dir = $('#input-dir')
        this.$dirWrapper = this.$dir.parent()

        this.$file = $('#input-file')
        this.$fileWrapper = this.$file.parent()
        this.$fileImg = this.$fileWrapper.find('img')

        this.registerEvents()

        return this
    },

    /*
     * Proxies events to the specified functions
     */
    registerEvents : function () {
        this.$dir.on('change', this.readDirectory.bind(this))
        this.$file.on('change', this.readFile.bind(this))
    },

    /*
     * Is fired when the user uploads an image directory
     * 
     * Reads all passed files, prepares an objects with the image
     * classes (e.g. apple1, basket1) and passes it all to the 
     * ImageManager
     */
    readDirectory : function (event) {
        const files = []
        const objects = {}

        for (let f = 0; f < event.target.files.length; f++) {
            const file = event.target.files[f]
            if (file.type.indexOf('image') > -1) files.push(file)
        }
        const length = files.length
        let readFiles = 0
        progress.do(length, 'files processed')

        for (let f = 0; f < length; f++) {
            (file => {
                const objectName = file.name.split('_')[0]
                if (!objects[objectName]) objects[objectName] = []

                const reader = new FileReader()
                reader.onload = data => {
                    objects[objectName].push(data.target.result)

                    if (++readFiles === length) {
                        this.$dirWrapper.remove()
                        // this.$fileWrapper.removeClass('hidden')
                        imageManager.addImages(objects, length)
                    }
                }
                reader.readAsDataURL(file)
            })(files[f])
        }
    },

    /*
     * @Deprecated
     * Reads a single file that will be checked against the
     * already initialized cluster
     */
    readFile : function (event) {
        const self = this
        const file = event.target.files[0]
        if (!file) return

        progress.do(0, 'Processing image')
        const reader = new FileReader()
        reader.onload = data => {
            self.$fileImg.attr('src', data.target.result)
            imageManager.add(data.target.result)
        }
        reader.readAsDataURL(file)
    },

}
