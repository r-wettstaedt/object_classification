/*
 * Clusters the passed vectors using
 * k-means++ algorithm
 */

import { euklidDistance } from '../util/'

const kmeans = {

    /*
     * Initializes this fields and starts clustering
     */
    init : function (vectors, cb) {
        this.vectors = vectors

        this.clusterCount = 200
        this.clusters = []
        this.cb = cb

        // this.assignCentersRandomly()
        this.assignCentersPlusPlus()
        this.calcClusters()
        return this.clusters
    },

    /*
     * Iterates through the clustering process until
     * the clusters centers don't too far anymore
     */
    calcClusters : function () {
        let isDistanceLarge = true

        while (isDistanceLarge) {
            this.assignVectorsToCenters()
            isDistanceLarge = this.assignCenters()
        }

        if (typeof this.cb === 'function') this.cb(2)
    },

    /*
     * Finding the nearest cluster centers for each
     * vector and assign them to the center
     */
    assignVectorsToCenters : function () {
        for (let k = 0; k < this.clusterCount; k++) {
            this.clusters[k].vectors = []
        }

        for (let i = 0; i < this.vectors.length; i++) {

            const vectors = this.vectors[i]
            let center = { distance : Number.MAX_SAFE_INTEGER }

            for (let c = 0; c < this.clusters.length; c++) {
                const distance = euklidDistance(vectors.vector, this.clusters[c].center)
                if (distance < center.distance) center = { distance : distance, index : c }
            }
            vectors.distance = center.distance

            this.clusters[center.index].vectors.push(vectors)

        }
    },

    /*
     * Calculate the mean center of a cluster's vectors
     * and assign the center to it
     */
    assignCenters : function () {
        let isDistanceLarge = false
        for (let k = 0; k < this.clusterCount; k++) {
            const cluster = this.clusters[k]
            const oldCenters = cluster.center.slice(0)
            cluster.center = Array(this.vectors[0].vector.length).fill(0)

            for (let i = 0; i < cluster.vectors.length; i++) {
                const vectors = cluster.vectors[i]
                for (let a = 0; a < vectors.vector.length; a++) cluster.center[a] += vectors.vector[a]
            }

            let distance = 0
            for (let a = 0; a < cluster.center.length; a++) {
                cluster.center[a] /= cluster.vectors.length
                distance += Math.pow(cluster.center[a] - oldCenters[a], 2)
            }
            if (distance > 100) isDistanceLarge = true
        }

        return isDistanceLarge
    },

    /*
     * k-means Cluster initialization using random values
     */
    assignCentersRandomly : function () {
        const taken = Array(this.vectors.length).fill(false)
        for (let k = 0; k < this.clusterCount; k++) {
            let random = Math.floor(Math.random() * this.vectors.length)
            while (taken[random]) {
                random = Math.floor(Math.random() * this.vectors.length)
            }
            taken[random] = true
            this.clusters.push({
                center : this.vectors[random].vector,
                vectors : [],
            })
            if (typeof this.cb === 'function') this.cb(1)
        }
    },

    /*
     * k-means++ Cluster initialization
     */
    assignCentersPlusPlus : function () {
        let random = Math.floor(Math.random() * this.vectors.length)
        this.clusters.push({
            center : this.vectors[random].vector,
            vectors : [],
        })
        const taken = Array(this.vectors.length).fill(false)

        for (let k = 1; k < this.clusterCount; k++) {

            const d2 = []
            for (let i = 0; i < this.vectors.length; i++) {

                const vectors = this.vectors[i]
                let center = { distance : Number.MAX_SAFE_INTEGER }
                if (taken[i]) continue

                for (let c = 0; c < this.clusters.length; c++) {
                    const distance = euklidDistance(vectors.vector, this.clusters[c].center)
                    if (distance < center.distance) center = { distance : distance, index : i }
                }

                d2.push(center)

            }

            let sum = 0
            for (let d = 0; d < d2.length; d++) sum += d2[d].distance

            random = Math.random()
            for (let d = 0; d < d2.length; d++) {
                d2[d].prob = d2[d].distance / sum
                if (d) d2[d].cumProb = d2[d - 1].cumProb + d2[d].prob
                else d2[d].cumProb = d2[d].prob

                if (random < d2[d].cumProb) {
                    this.clusters.push({
                        center : this.vectors[d2[d].index].vector,
                        vectors : [],
                    })
                    taken[d2[d].index] = true
                    break
                }
            }
            if (typeof this.cb === 'function') this.cb(1)

        }

        if (typeof this.cb === 'function') this.cb(1)
    },

    /*
     * @Deprecated
     * Add a new vector to the passed clusters and recluster
     * with the new vector
     */
    addVector : function (vectors, clusters) {
        this.vectors = vectors
        this.clusterCount = clusters.length
        this.clusters = clusters

        this.calcClusters()
        return this.clusters
    },
}

export default {
    init : kmeans.init.bind(kmeans),
    addVector : kmeans.addVector.bind(kmeans),
}
