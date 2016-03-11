/*
 * @Deprecated
 * Starting point of the application
 */

/*
import $ from 'jquery'
import { setColorInPixelArray } from './util'
import grayscale from './grayscale'
import { derivate } from './filter'
import harris from './harris'
import descriptor from './descriptor'
import kmeans from './kmeans'

export default function () {
    const $src = $('canvas#src')
    const $x = $('canvas#x')
    const $y = $('canvas#y')
    const $xx = $('canvas#xx')
    const $xy = $('canvas#xy')
    const $yy = $('canvas#yy')
    const $hxx = $('canvas#hxx')
    const $hxy = $('canvas#hxy')
    const $hyy = $('canvas#hyy')
    const $l1 = $('canvas#l1')
    const $l2 = $('canvas#l2')
    const $q1 = $('canvas#q1')
    const $q2 = $('canvas#q2')

    const sctx = $src[0].getContext('2d')
    const xctx = $x[0].getContext('2d')
    const yctx = $y[0].getContext('2d')
    const xxctx = $xx[0].getContext('2d')
    const xyctx = $xy[0].getContext('2d')
    const yyctx = $yy[0].getContext('2d')
    const hxxctx = $hxx[0].getContext('2d')
    const hxyctx = $hxy[0].getContext('2d')
    const hyyctx = $hyy[0].getContext('2d')
    const l1ctx = $l1[0].getContext('2d')
    const l2ctx = $l2[0].getContext('2d')
    const q1ctx = $q1[0].getContext('2d')
    const q2ctx = $q2[0].getContext('2d')

    const image = new Image()
    image.onload = function () {
        $src[0].width = image.width
        $src[0].height = image.height
        $x[0].width = image.width
        $x[0].height = image.height
        $y[0].width = image.width
        $y[0].height = image.height
        $xx[0].width = image.width
        $xx[0].height = image.height
        $xy[0].width = image.width
        $xy[0].height = image.height
        $yy[0].width = image.width
        $yy[0].height = image.height
        $hxx[0].width = image.width
        $hxx[0].height = image.height
        $hxy[0].width = image.width
        $hxy[0].height = image.height
        $hyy[0].width = image.width
        $hyy[0].height = image.height
        $l1[0].width = image.width
        $l1[0].height = image.height
        $l2[0].width = image.width
        $l2[0].height = image.height
        $q1[0].width = image.width
        $q1[0].height = image.height
        $q2[0].width = image.width
        $q2[0].height = image.height

        sctx.drawImage(image, 1, 1)

        const imageData = sctx.getImageData(0, 0, image.width, image.height)
        const pixels = imageData.data

        grayscale(pixels, image)
        sctx.putImageData(imageData, 0, 0)

        // sift(pixels, image, $x)

        const gradients = derivate(pixels, image)
        let id = new ImageData(gradients.UintImageX, image.width, image.height)
        xctx.putImageData(id, 0, 0)
        id = new ImageData(gradients.UintImageY, image.width, image.height)
        yctx.putImageData(id, 0, 0)

        const h = harris(pixels, image, gradients)
        id = new ImageData(h.UintImageXX, image.width, image.height)
        xxctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintImageXY, image.width, image.height)
        xyctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintImageYY, image.width, image.height)
        yyctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintImageHXX, image.width, image.height)
        hxxctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintImageHXY, image.width, image.height)
        hxyctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintImageHYY, image.width, image.height)
        hyyctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintLambda1, image.width, image.height)
        l1ctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintLambda2, image.width, image.height)
        l2ctx.putImageData(id, 0, 0)
        id = new ImageData(h.UintQ, image.width, image.height)
        q1ctx.putImageData(id, 0, 0)

        const f = descriptor(pixels, image, h.corners, h.imageXY)

        const clusters = kmeans(f.poi)
        const imageF = pixels.slice(0)

        for (let k = 0; k < clusters.length; k++) {

            const cluster = clusters[k]
            const rgb = [ Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255) ]

            for (let i = 0; i < cluster.poi.length; i++) {
                const poi = cluster.poi[i]

                const positions = []
                const x = poi.corner.x
                const y = poi.corner.y
                if (y - 1 >= 0)
                    positions.push(((y - 1) * image.width + x) * 4)
                if (x - 1 >= 0)
                    positions.push(((y) * image.width + x - 1) * 4)
                if (y + 1 < image.height)
                    positions.push(((y + 1) * image.width + x) * 4)
                if (x + 1 < image.width)
                    positions.push(((y) * image.width + x + 1) * 4)

                for (let p = 0; p < positions.length; p++) {
                    setColorInPixelArray(imageF, positions[p], rgb)
                }

                const $env = $('<canvas>')
                $env[0].width = 16
                $env[0].height = 16
                id = new ImageData(poi.environment, 16, 16)
                $env[0].getContext('2d').putImageData(id, 0, 0)
                $env.css({
                    width : '8%',
                    outline: `8.5px solid rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
                })
                $q2.after($env)
            }
        }
        id = new ImageData(imageF, image.width, image.height)
        q2ctx.putImageData(id, 0, 0)
    }
    // image.src = 'images/bridge.png'
    image.src = 'images/cow.png'
    // image.src = 'images/test.png'
    // image.src = 'images/50Objects/apple1_1.JPG'
}
*/