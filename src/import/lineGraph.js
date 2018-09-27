var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-shape")
);

var drawChart = function () {
    let svgContainer = d3.select("." + this.chartData.selector),
        ds = this.getData(),
        cs = {
            x: {
                domain: [],
                range: [],
                axisWidth: 30
            }, y: {}
        };
    cs.y.scale = d3.scaleLinear()
            .domain([this.getMin(), this.getMax()])
            .range([this.getHeight(), this.getTitleHeight()])
    
    cs.y.axis = d3.axisLeft().ticks(10, "s").scale(cs.y.scale)

    ds.forEach(t => cs.x.domain.push(t["dim"]));
    ds.forEach((t, i) => cs.x.range.push(((this.getWidth() * i) - this.getTitleHeight()) / ds.length));
    
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    
    cs.lineFunction = d3.line()
        .x((d, i) => cs.x.scale(d["dim"]) + cs.x.axisWidth)
        .y(d => cs.y.scale(d["metric"]))

    svgContainer.append('path')
        .datum(ds)
        .attr('fill', 'none')
        .attr('stroke', '#ffab00')
        .attr('stroke-width', 3)
        .attr('d', cs.lineFunction)
        .attr('transform', 'translate(0,0)');

    svgContainer.append("g").attr("transform", "translate(" + cs.x.axisWidth+ ",0)").call(cs.y.axis);
    svgContainer.append("g").attr("transform", "translate(45, 300)").call(cs.x.axis);
};

export default drawChart;