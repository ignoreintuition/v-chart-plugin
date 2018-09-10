var d3 = Object.assign({}, 
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let yScale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([this.getHeight(), 0]);
    
    let svgContainer = d3.select("." + this.chartData.selector);
    let xOffset = 30,
        yAxisWidth = 25;

    svgContainer.selectAll("g")
        .data(this.chartData.data)
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return ((this.getWidth() - xOffset) / this.chartData.data.length - 1);
        }).attr("height", (d, i) => {
            return yScale(this.getHeight() - d);
        }).attr("x",  (d, i) => {
            return (i * (this.getWidth() - xOffset ) / this.chartData.data.length - 1) + xOffset;
        }).attr("y", (d, i) => {
            return yScale(d);
        });

    let yAxis = d3.axisLeft().scale(yScale);
    let yAxisCoord = this.getWidth() - xOffset;
    svgContainer.append("g").attr("transform", "translate("+ yAxisWidth +",0)").call(yAxis);
};

export default drawChart;