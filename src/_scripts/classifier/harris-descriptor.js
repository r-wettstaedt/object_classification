/*
 * A harris corner descriptor using SIFT descriptor features
 */

import { euklidDistance } from '../util/'

const regionSize = 4
const sigma = 1.5

export default function (image, corners) {
    const histograms = Array(corners.length)

    const dimensions = 18
    const threeSixtyStepSize = 180 / dimensions

    for (let c = 0; c < corners.length; c++) {
        const corner = corners[c]

        const histogram = Array(dimensions + 1).fill(1)

        for (let y = -regionSize; y < regionSize; y++) {
            for (let x = -regionSize; x < regionSize; x++) {

                const posX = [
                    corner.x + x,
                    corner.x + x + 1,
                    corner.x + x - 1,
                ]
                const posY = [
                    corner.y + y,
                    corner.y + y + 1,
                    corner.y + y - 1,
                ]

                /* Treat borders of the image with pixel repetition */
                for (let i = 0; i < posX.length; i++) {
                    if (posX[i] < 0) posX[i] = 0
                    if (posX[i] >= image.width) posX[i] = image.width - 1
                }
                for (let i = 0; i < posY.length; i++) {
                    if (posY[i] < 0) posY[i] = 0
                    if (posY[i] >= image.width) posY[i] = image.width - 1
                }

                /* Calculate the gradient vector */
                const gVector = {
                    x : image.pixels[(posY[0] * image.width + posX[1]) * 4] -
                        image.pixels[(posY[0] * image.width + posX[2]) * 4],

                    y : image.pixels[(posY[1] * image.width + posX[0]) * 4] -
                        image.pixels[(posY[2] * image.width + posX[0]) * 4],
                }

                /* The length of the gradient vector */
                const m = Math.sqrt(Math.pow(gVector.x, 2) + Math.pow(gVector.y, 2))
                /* The angle of the gradient vector */
                const angle = Math.atan2(gVector.y, gVector.x) * 180 / Math.PI

                /* @Deprecated: The gaussian normal distribution */
                const _pos = euklidDistance([x, y], [0, 0])
                const w = Math.pow(Math.E, -Math.pow(_pos / sigma, 2) / 2) / (sigma * Math.sqrt(2 * Math.PI))


                /* Binning the angle of the gradient vector on the 18-dim feature vector */
                histogram[Math.round(Math.abs(angle) / threeSixtyStepSize)] += m

            }
        }

        histograms[c] = {
            corner : corner,
            vector : histogram,
            index : image.index,
            class : image.class,
        }

    }

    return histograms

}
