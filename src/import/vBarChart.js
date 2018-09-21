var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let svgContainer = d3.select("." + this.chartData.selector),
        xOffset = 40,
        yAxisWidth = 35,
        yOffset = this.getTitleHeight() + 5,
        yScale = d3.scaleLinear()
            .domain([0, this.getMax()])
            .range([this.getHeight(), yOffset]);

    svgContainer.selectAll("g")
        .data(this.getData())
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return ((this.getWidth() - xOffset) / this.chartData.data.length - 1);
        }).attr("height", (d, i) => {
            return this.getHeight() - yScale(d.metric);
        }).attr("x", (d, i) => {
            return (i * (this.getWidth() - xOffset) / this.chartData.data.length - 1) + xOffset;
        }).attr("y", (d, i) => {
            return yScale(d.metric);
        });

    let yAxis = d3.axisLeft().ticks(10, "s").scale(yScale);
    let yAxisCoord = this.getWidth() - xOffset;
    svgContainer.append("g").attr("transform", "translate(" + yAxisWidth + ",0)").call(yAxis);
};

export default drawChart;