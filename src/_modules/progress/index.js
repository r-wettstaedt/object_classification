/*
 * Displays a progress bar
 */

import $ from 'jquery'

export default {

    /*
     * Initializes this module's DOM elements
     */
    init : function () {
        this.className = 'progress'
        this.$el = $(`.${this.className}`)

        this.$info = $(`.${this.className}__info`, this.$el)
        this.$label = $(`.${this.className}__label`, this.$el)
        this.$bar = $(`.${this.className}__bar`, this.$el)

        return this
    },

    /*
     * Create a new progress bar with the passed details
     */
    do : function (maxItems, label) {
        this.show()
        this.current = {
            max : maxItems,
            step : 0,
            label : label,
            percent : 0,
        }

        this.updateUI()
    },

    /*
     * Update the bar's progress
     */
    tick : function () {
        this.current.step++
        this.percent = this.current.step / this.current.max * 100

        this.updateUI()

        if (this.percent >= 100) this.hide()

        return this.percent
    },

    /*
     * Update the bar's DOM element progress
     */
    updateUI : function () {
        let progressLabel = `${this.current.step} / ${this.current.max}`
        if (!this.current.max) {
            this.$info.addClass(`${this.className}__info--no-bar`)
            progressLabel = ''
        }

        this.$label.html(`${progressLabel} ${this.current.label}`)
        this.$bar.css('width', `${this.percent}%`)
    },

    /*
     * Show the DOM element
     */
    show : function () {
        this.$el.removeClass('hidden')
        this.$info.removeClass(`${this.className}__info--no-bar`)
    },

    /*
     * Hide the DOM element
     */
    hide : function () {
        this.$el.addClass('hidden')
        this.current = {
            max : 0,
            step : 0,
            label : '',
            percent : 0,
        }
        this.updateUI()
        this.$info.addClass(`${this.className}__label--no-bar`)
    },

}
