var d3 = Object.assign({}, 
    require("d3-selection"));
    
const Chart = {
    install(Vue, options) {
        Vue.component('v-chart', {
            props: ['chartData'], 
            data: function () {
                return {
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
                drawChart: function () {
                    d3.select(this.chartData.selector)
                        .append("text")
                        .attr("x", 20)
                        .attr("y", 20)
                        .style("text-anchor", "left")
                        .text(this.chartData.title)

                    d3.select(this.chartData.selector)
                        .selectAll("g")
                        .data(this.chartData.data)
                        .enter().append("g")
                        .append("rect")
                        .attr("width", function (d) {
                            return d;
                        }).attr("height", 20)
                        .attr("y", function (d, i) {
                            return (i + 1.5) * 20 + i
                        }).attr("x", 0);
                },
                clearCanvas: function () {
                    d3.select(this.chartData.selector).selectAll("*").remove();
                },
                getHeight: function () {
                    return this.chartData.height || 200;
                },
                getWidth: function () {
                    return this.chartData.width || 200;
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