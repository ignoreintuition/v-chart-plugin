var d3 = Object.assign({},
    require("d3-selection")
);
import barChart     from './import/barChart'
import vBarChart    from './import/vBarChart'
import lineGraph    from './import/lineGraph'
import scatterPlot  from './import/scatterPlot'
import pieChart     from './import/pieChart'
import areaChart    from './import/areaChart'

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
                    this[this.chartData.chartType]('init');
                },
                refreshChart: function () {
                    //this.clearCanvas();
                    //this.drawTitle();
                    this[this.chartData.chartType]('refresh');
                },
                clearCanvas: function () {
                    d3.select("#" + this.chartData.selector).selectAll("*").remove();
                },
                drawTitle: function () {
                    d3.select("#" + this.chartData.selector)
                        .append("text")
                        .attr("x", this.width / 2)
                        .attr("y", this.titleHeight - this.titleHeight * .1)
                        .style("text-anchor", "middle")
                        .text(this.chartData.title)
                    
                    d3.select("#" + this.chartData.selector)
                        .append("text")
                        .attr("x", this.width / 2)
                        .attr("y", this.titleHeight - this.titleHeight * .1 + this.subtitleHeight )
                        .style("text-anchor", "middle")
                        .text(this.chartData.subtitle)
                },
                addTooltip: function (d, e) {
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
                removeTooltip: function (d) {
                    d3.select("#" + this.chartData.selector)
                        .selectAll(".tt").remove();
                },
                ...((typeof barChart !== 'undefined') && {barChart: barChart}),
                ...((typeof vBarChart !== 'undefined') && {vBarChart: vBarChart}),
                ...((typeof scatterPlot !== 'undefined') && {scatterPlot: scatterPlot}),
                ...((typeof pieChart !== 'undefined') && {pieChart: pieChart}),
                ...((typeof areaChart !== 'undefined') && {areaChart: areaChart}),
                ...((typeof lineGraph !== 'undefined') && {lineGraph: lineGraph}),
            },
            computed: {
                ds: function () {
                    return this.chartData.data.map(d => {
                        let td = {};
                        td.metric = this.chartData.metric ? d[this.chartData.metric] : d;
                        td.dim = this.chartData.dim ? d[this.chartData.dim] : null;
                        return td;
                    });
                },
                height: function () {
                    return this.chartData.height || 200;
                },
                width: function () {
                    return this.chartData.width || 200;
                },
                max: function () {
                    let max = 0;
                    this.ds.forEach(function (e) {
                        max = max > e.metric ? max : e.metric;
                    })
                    return max;
                },
                min: function () {
                    return Math.min.apply(Math, this.ds.map(function (o) {
                        return o['metric'];
                    }));
                },
                titleHeight: function () {
                    if (this.chartData.title)
                        return this.chartData.textHeight || 25;
                    return 0;
                },
                subtitleHeight: function () {
                    if (this.chartData.subtitle)
                        return this.chartData.textHeight * .66 || 25 * .66;
                    return 0;
                },
                header: function () {
                    return (this.titleHeight + this.subtitleHeight);
                }

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
                `<svg :id="this.chartData.selector" x="5" y="5" :height="this.height + 20" :width="this.width + 20"> </svg>`
        })
    }
}

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Chart)
}

