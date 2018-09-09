var d3 = Object.assign({}, 
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
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
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return (this.getWidth() / this.chartData.data.length - 1)
        }).attr("height", (d, i) => {
            return d;
        }).attr("x",  (d, i) => {
            return (i * this.getWidth() / this.chartData.data.length - 1);
        }).attr("y", (d, i) => {
            return this.getHeight() - d;
        });

    // let xAxis = d3.axisBottom().scale(xScale);
    // let xAxisCoord = this.getHeight() - 20;
    // svgContainer.append("g").attr("transform", "translate(0, " + xAxisCoord + ")").call(xAxis);
};

export default drawChart;