var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-shape")
);

var drawChart = function () {
    let ds = this.getData();

    let yScale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([this.getHeight(), 0]);

    let yAxis = d3.axisLeft()
        .scale(yScale);

    let domainArr = [];
    let rangeArr = [];

    ds.forEach((t) => {
        domainArr.push(t["dim"]);
    });

    ds.forEach((t, i) => {
        rangeArr.push(this.getWidth() * (i) / ds.length)
    });

    var xScale = d3.scaleOrdinal()
        .domain(domainArr)
        .range(rangeArr);

    var xAxis = d3.axisBottom()
        .scale(xScale);

    let svgContainer = d3.select("." + this.chartData.selector);

    var lineFunction = d3.line()
        .x((d, i) => {
            return xScale(d["dim"]);
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
};

export default drawChart;