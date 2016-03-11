/*
 * Utility function used by the modules
 */


/*
 * Calculate the eigenvalues of the passed matrix
 */
export function eig (matrix) {
    const b = -(matrix[0] + matrix[3])
    const c = (matrix[0] * matrix[3]) - (matrix[1] * matrix[2])

    const lambda1 = (-b + Math.sqrt(b * b - 4 * c)) / 2
    const lambda2 = (-b - Math.sqrt(b * b - 4 * c)) / 2

    return [ lambda1, lambda2 ]
}


/*
 * A pixelarray returned by the HTML5 canvas has the folowing structure:
 * pixels[0] = red
 * pixels[1] = green
 * pixels[2] = blue
 * pixels[3] = alpha
 * 
 * This function sets the passed color on the passed position
 */
export function setColorInPixelArray (pixels, pos, color) {
    if (typeof color === 'object') {
        pixels[pos + 0] = color[0]
        pixels[pos + 1] = color[1]
        pixels[pos + 2] = color[2]
        pixels[pos + 3] = 255
    } else {
        pixels[pos + 0] = color
        pixels[pos + 1] = color
        pixels[pos + 2] = color
        pixels[pos + 3] = 255
    }
}


/*
 * Calculate the euklid distance betwenn the two passed vectors
 */
export function euklidDistance (a, b) {
    if (a.length !== b.length) throw `Vector a (length = ${a.length}) and b (length = ${b.length}) do not have the same length`

    let distance = 0
    for (let i = 0; i < a.length; i++) {
        distance += Math.pow(a[i] - b[i], 2)
    }
    return distance
}


/*
 * Calculate the grayscaled pixel on the passed coordinates as
 * well as on the subsequent pixels in a 3x3 region
 */
export function grayscale (image, x, y) {

    for (let kY = 0; kY <= 1; kY++) {
        for (let kX = 0; kX <= 1; kX++) {

            /*
             * Positions in Kernel
             * [      0,  1,
             *    2,  3,  4 ]
             */

            if (x + kX >= image.width)
                x = image.width - kX - 1

            if (y + kY >= image.height)
                y = image.height - kY - 1

            const _pos = ((y + kY) * image.width + (x + kX)) * 4

            const mean = (
                image.pixels[_pos + 0] +
                image.pixels[_pos + 1] +
                image.pixels[_pos + 2]
            ) / 3

            setColorInPixelArray(image.pixels, _pos, mean)

        }
    }


}
