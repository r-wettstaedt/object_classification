/*
 * Starting point of the application
 * Init all modules
 */

import $ from 'jquery'

import progress from '../_modules/progress'
import fileManager from '../_modules/file-manager'
import imageManager from '../_modules/image-manager'

$(() => {
    progress.init()
    fileManager.init()
    imageManager.init()
})
