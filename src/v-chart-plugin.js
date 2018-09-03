var d3 = Object.assign({}, 
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

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
                drawChart: function () {
                    let xScale = d3.scaleLinear()
                        .domain([0, this.getMax()])
                        .range([0, this.getWidth()]);
                    
                    let svgContainer = d3.select("." + this.chartData.selector);

                    svgContainer.append("text")
                        .attr("x", this.getWidth() / 2)
                        .attr("y", this.getTitleHeight() - this.getTitleHeight() * .1)
                        .style("text-anchor", "middle")
                        .text(this.chartData.title)
                
                    svgContainer.selectAll("g")
                        .data(this.chartData.data)
                        .enter().append("g")
                        .append("rect")
                        .attr("class", this.barChartSelector)
                        .attr("width", d => {
                            return xScale(d) ;
                        }).attr("height", (d, i) => {
                            return (this.getHeight() - this.getTitleHeight() - 21) / this.chartData.data.length - 1
                        }).attr("y",  (d, i) => {
                            return i * (this.getHeight() - this.getTitleHeight()- 21 ) / this.chartData.data.length + 1 + this.getTitleHeight();
                        }).attr("x", 0);

                    let xAxis = d3.axisBottom().scale(xScale);
                    let xAxisCoord = this.getHeight() - 20;
                    svgContainer.append("g").attr("transform", "translate(0, " + xAxisCoord + ")").call(xAxis);
                },

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
