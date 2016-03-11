/*
 * Filter utilities
 */


/*
 * Some filterkernels
 */
export const kernels = {
    sobelX : [ 0.125,  0.000, -0.125,
               0.250,  0.000, -0.250,
               0.125,  0.000, -0.125],

    sobelY : [ 0.125,  0.250,  0.125,
               0.000,  0.000,  0.000,
              -0.125, -0.250, -0.125],

    gauss : [ 0.0625,  0.125, 0.0625,
               0.125,   0.25,  0.125,
              0.0625,  0.125, 0.0625],
}


/*
 * Apply the passed 3x3 kernels to the coordinates of the passed image
 * Returns the color value on the specific coordinates
 */
export function applyKernels (image, pixels, x, y, ...kernels) {

    const colors = []
    for (let i = 0; i < kernels.length; i++)
        colors[i] = 0

    for (let kY = -1; kY <= 1; kY++) {
        for (let kX = -1; kX <= 1; kX++) {

            /*
             * Positions in Kernel
             * [ -4, -3, -2,
             *   -1,  0,  1,
             *    2,  3,  4 ]
             */

            if (y + kY < 0)
                y = -kY

            if (x + kX < 0)
                x = -kX

            if (x + kX >= image.width)
                x = image.width - kX - 1

            if (y + kY >= image.height)
                y = image.height - kY - 1

            const kernelPos = kY * 3 + kX
            const _pos = ((y + kY) * image.width + (x + kX)) * 4

            for (let i = 0; i < kernels.length; i++) {
                colors[i] += pixels[_pos] * kernels[i][kernelPos + 4]
            }

        }
    }

    if (kernels.length === 1) return colors[0]

    return colors
}


/*
 * Calculate the gradients on the specified coordinates using
 * the Sobel filter
 */
export function derivate (image, x, y) {
    const colors = applyKernels(
        image, image.pixels, x, y, kernels.sobelX, kernels.sobelY
    )

    return {
        X : colors[0],
        Y : colors[1],
    }
}


/*
 * Analyzes the 3x3 region around the passed coordinates
 * and if the signal on the passed coordinates is the maxima returns 
 * the positions of the lower value neighbors 
 */
export function maxima (pixels, image, x, y) {
    const pos = (y * image.width + x) * 4
    const lowerValues = []

    for (let kY = -1; kY <= 1; kY++) {
        for (let kX = -1; kX <= 1; kX++) {

            const _pos = ((y + kY) * image.width + (x + kX)) * 4

            if (y + kY < 0 ||
                x + kX < 0 ||
                x + kX >= image.width ||
                y + kY >= image.height ||
                pos === _pos)

                continue

            if (pixels[pos] <= pixels[_pos]) return false

            lowerValues.push(_pos)

        }
    }

    return lowerValues

}


export default {

    kernels : kernels,

    applyKernels : applyKernels,
    derivate : derivate,
    maxima : maxima,

}
