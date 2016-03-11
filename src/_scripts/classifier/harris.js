/*
 * Find points of interests in the passed image
 */ 

import { eig, setColorInPixelArray } from '../util/'
import { kernels, applyKernels, maxima } from '../util/filter'

export default function (image, gradients) {

    const Q = new Array(image.pixels.length)

    let corners = []

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {

            const pos = (y * image.width + x) * 4

            /* Apply gauss filter to the gradients */
            const HXX = applyKernels(image, gradients.imageXX, x, y, kernels.gauss)
            const HXY = applyKernels(image, gradients.imageXY, x, y, kernels.gauss)
            const HYY = applyKernels(image, gradients.imageYY, x, y, kernels.gauss)

            /* Structure Matrix M */
            const M = [
                HXX, HXY,
                HXY, HYY,
            ]
            const eigenvalues = eig(M)

            /* Corner Response Q */
            const q = eigenvalues[0] * eigenvalues[1] - 0.24 * Math.pow(eigenvalues[0] + eigenvalues[1], 2)

            setColorInPixelArray(Q, pos, q)

            /* Corner Repsonse threshold */
            if (q < 0) continue

            /* Maxima analysis */
            const lowerValues = maxima(Q, image, x, y)
            if (!lowerValues || !lowerValues.length) continue

            corners.push({
                x : x,
                y : y,
                pos : pos,
                Q : q,
            })

            /* Remove Points of interests in the 3x3 region around the new maximum */
            for (let l = 0; l < lowerValues.length; l++) {
                corners = corners.filter((index, corner) => {
                    return lowerValues[l] !== corner.pos
                })
            }

        }
    }

    return corners

}
