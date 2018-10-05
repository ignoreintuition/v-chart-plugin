var d3 = Object.assign({},
    require("d3-selection")
);

import barChart from './import/barChart'
import vBarChart from './import/vBarChart'
import lineGraph from './import/lineGraph'
import scatterPlot from './import/scatterPlot'

const Chart = {
    install(Vue, options) {
        Vue.component('v-chart', {
            props: ['chartData'],
            data: function () {
                return {
                    selector: this.chartData.selector + "-" + this.chartData.chartType
                }
            },
            methods: {
                initalizeChart: function () {
                    this.drawTitle();
                    this[this.chartData.chartType]();
                },
                refreshChart: function () {
                    this.clearCanvas();
                    this.drawTitle();
                    this[this.chartData.chartType]();
                },
                clearCanvas: function () {
                    d3.select("#" + this.chartData.selector).selectAll("*").remove();
                },
                drawTitle: function () {
                    d3.select("#" + this.chartData.selector)
                        .append("text")
                        .attr("x", this.getWidth() / 2)
                        .attr("y", this.getTitleHeight() - this.getTitleHeight() * .1)
                        .style("text-anchor", "middle")
                        .text(this.chartData.title)
                },
                addTooltip: function(d, e) {
                    d3.select("#" + this.chartData.selector)
                        .append("rect")
                        .attr("x", e.layerX - 5 - 50)
                        .attr("y", e.layerY - 13 - 25)
                        .attr("height", "16px")
                        .attr("width", "80px")
                        .attr("class", "tt")
                        .attr("fill", "white");

                    d3.select("#" + this.chartData.selector)
                        .append("text")
                        .attr("x", e.layerX - 50)
                        .attr("y", e.layerY - 25)
                        .attr("class", "tt")
                        .attr("font-size", "10px")
                        .text(d['dim'] + ':' + d['metric']);
                },
                removeTooltip: function(d) {
                    d3.select("#" + this.chartData.selector)
                    .selectAll(".tt").remove();
                },
                getHeight: function () {
                    return this.chartData.height || 200;
                },
                getWidth: function () {
                    return this.chartData.width || 200;
                },
                getData: function () {
                    return this.chartData.data.map(d => {
                        let td = {};
                        td.metric = this.chartData.metric ? d[this.chartData.metric] : d;
                        td.dim = this.chartData.dim ? d[this.chartData.dim] : null;
                        return td;
                    });
                },
                getMax: function () {
                    let max = 0;
                    this.getData().forEach(function (e) {
                        max = max > e.metric ? max : e.metric;
                    })
                    return max;
                },
                getMin: function () {
                    return Math.min.apply(Math, this.getData().map(function(o) {
                        return o['metric'];
                      }));
                },
                getTitleHeight: function () {
                    return this.chartData.textHeight || 25;
                },
                barChart: barChart,
                vBarChart: vBarChart,
                lineGraph: lineGraph,
                scatterPlot, scatterPlot
            },
            mounted: function () { 
                this.initalizeChart();
            },
            watch: {
                'chartData': {
                    handler: function (val) {
                        this.refreshChart();
                    },
                    deep: true
                }
            },
            template:
                `<svg :id="this.chartData.selector" x="5" y="5" :height="this.getHeight() + 10" :width="this.getWidth() + 10"> </svg>`
        })
    }
}

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Chart)
}

