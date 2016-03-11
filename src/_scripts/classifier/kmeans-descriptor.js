/*
 * Describes the k-means clusters using the Naive Bayes
 * Model
 * 
 * Finds the class of images that that most likely belongs
 * to the passed image
 */

export default function (data, image) {

    /* The passed image gets the wildcard class instead of 'apple1' */
    const wildcardClass = '?'

    data.objects[wildcardClass] = 0

    const length = data.clusters.length

    const histogram = Array(length)
    const totals = { total : 0 }

    const p = {}
    const w = { bestKey : null }

    for (let k = 0; k < length; k++) {
        histogram[k] = {}

        for (const key in data.objects) {
            if (key === 'length') continue

            histogram[k][key] = 0
            totals[key] = 0

            p[key] = 0
            w[key] = {}
        }
    }

    for (let k = 0; k < length; k++) {

        const vectors = data.clusters[k].vectors

        for (let i = 0; i < vectors.length; i++) {
            const vector = vectors[i]

            if (vector.index === image.index) {
                histogram[k][wildcardClass]++
                totals[wildcardClass]++
            } else {
                histogram[k][vector.class]++
                totals[vector.class]++

                if (vector.class !== wildcardClass) totals.total++
            }
        }
    }


    for (const key in data.objects) {
        if (key === 'length') continue

        p[key] = totals[key] / totals.total
    }


    for (const key in data.objects) {
        if (key === 'length') continue

        let c = Math.log(p[key])

        for (let k = 0; k < length; k++) {
            const l = (histogram[k][key] + 1) / (totals[key] + length)
            c += histogram[k][wildcardClass] * Math.log(l)
        }
        w[key] = c
        if (key !== wildcardClass) {
            if (!w.bestKey) w.bestKey = key
            if (c > w[w.bestKey]) w.bestKey = key
        }
    }

    return w

}
