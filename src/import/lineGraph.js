var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-shape")
);

var drawChart = function () {
    let ds = this.getData(),
        yOffset = this.getTitleHeight() + 5,
        yScale = d3.scaleLinear()
            .domain([this.getMin(), this.getMax()])
            .range([this.getHeight(), yOffset]),
        yAxis = d3.axisLeft()
            .scale(yScale),
        domainArr = [],
        rangeArr = [];

    ds.forEach((t) => {
        domainArr.push(t["dim"]);
    });
    ds.forEach((t, i) => {
        rangeArr.push(((this.getWidth() * (i)) - yOffset) / ds.length)
    });

    let xScale = d3.scaleOrdinal()
        .domain(domainArr)
        .range(rangeArr),
        xAxis = d3.axisBottom()
            .scale(xScale),
        svgContainer = d3.select("." + this.chartData.selector);

    var lineFunction = d3.line()
        .x((d, i) => {
            return xScale(d["dim"]) + yOffset + 10;
        })
        .y((d) => {
            return yScale(d["metric"]);
        })

    svgContainer.append('path')
        .datum(ds)
        .attr('fill', 'none')
        .attr('stroke', '#ffab00')
        .attr('stroke-width', 3)
        .attr('d', lineFunction)
        .attr('transform', 'translate(0,0)');
    
    svgContainer.append("g").attr("transform", "translate(" + yOffset + ",0)").call(yAxis);
};

export default drawChart;