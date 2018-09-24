var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let svgContainer = d3.select("." + this.chartData.selector),
        cs = {
            x: {
                padding: 5,
                axisHeight: 5
            }, y: {
                padding: 5
            }
        };

    cs.x.scale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([cs.x.padding, this.getWidth() - cs.x.padding]);

    svgContainer.selectAll("g")
        .data(this.getData())
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", d => {
            return cs.x.scale(d.metric);
        }).attr("height", (d, i) => {
            return (this.getHeight() - cs.x.axisHeight - this.getTitleHeight()) / this.chartData.data.length - 1
        }).attr("y", (d, i) => {
            return i * (this.getHeight() - cs.x.axisHeight - this.getTitleHeight() - 21) / this.chartData.data.length + 1 + this.getTitleHeight();
        }).attr("x", cs.x.padding);

    cs.x.axis = d3.axisBottom().ticks(10, "s").scale(cs.x.scale);
    cs.x.offset = this.getHeight() - this.getTitleHeight();
    svgContainer.append("g").attr("transform", "translate(0, " + cs.x.offset + ")").call(cs.x.axis);
};

export default drawChart;