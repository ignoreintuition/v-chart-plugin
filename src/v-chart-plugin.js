var d3 = Object.assign({}, 
    require("d3-selection")
);

import barChart from './import/barChart'

const Chart = {
    install(Vue, options) {
        Vue.component('v-chart', {
            props: ['chartData'], 
            data: function () {
                return {
                    barChartSelector: this.chartData.selector + "-bar"
                }
            },
            methods: {
                initalizeChart: function () {
                    this.drawChart();
                },
                refreshChart: function () {
                    this.clearCanvas();
                    this.drawChart();
                },
                drawChart: barChart,
                clearCanvas: function () {
                    d3.select("." + this.chartData.selector).selectAll("*").remove();
                },
                getHeight: function () {
                    return this.chartData.height || 200;
                },
                getWidth: function () {
                    return this.chartData.width || 200;
                },
                getMax: function () {
                    let max = 0;
                    this.chartData.data.forEach(function(e){
                        max = max > e ? max : e; 
                    })
                    return max;
                },
                getTitleHeight: function() {
                    return this.chartData.textHeight || 25;
                }
            },
            mounted: function () { // <-- lifecycle events
                this.initalizeChart();
            },
            watch: { // <-- watch functions
                'chartData': {
                    handler: function (val) {
                        this.refreshChart();
                    },
                    deep: true
                }
            },
            template:
                `<svg class="chart" :height="this.getHeight()" :width="this.getWidth()"> </svg>`
        })
    }
}

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyPlugin)
}

