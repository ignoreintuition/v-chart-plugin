var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let svgContainer = d3.select("." + this.chartData.selector),
        cs = {
            x: {
                axisWidth: 40
            }, y: {}
        };

    cs.y.scale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([this.getHeight(), this.getTitleHeight()]);

    svgContainer.selectAll("g")
        .data(this.getData())
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return ((this.getWidth() - cs.x.axisWidth) / this.chartData.data.length - 1);
        }).attr("height", (d, i) => {
            return this.getHeight() - cs.y.scale(d.metric);
        }).attr("x", (d, i) => {
            return (i * (this.getWidth() - cs.x.axisWidth) / this.chartData.data.length - 1) + cs.x.axisWidth;
        }).attr("y", (d, i) => {
            return cs.y.scale(d.metric);
        });

    cs.y.axis = d3.axisLeft().ticks(10, "s").scale(cs.y.scale);
    svgContainer.append("g").attr("transform", "translate(" + cs.x.axisWidth + ",0)").call(cs.y.axis);
};

export default drawChart;