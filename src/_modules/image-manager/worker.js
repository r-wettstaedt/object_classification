/*
 * The background thread module
 */

import classifier from '../../_scripts/classifier'

module.exports = function (self) {

    /*
     * Listen for a message from the main thread to finally
     * start doing stuff
     */
    self.addEventListener('message', event => {

        const result = classifier(event.data, a => self.postMessage(a))
        self.postMessage(result)

    })

}
