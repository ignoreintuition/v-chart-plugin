var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-shape")
);

var drawChart = function () {
    let svgContainer = d3.select("#" + this.chartData.selector),
        ds = this.getData(),
        cs = {
            x: {
                domain: [],
                range: [],
                axisHeight: 45
            }, y: {
                axisWidth: 45
            }
        };
    cs.y.scale = d3.scaleLinear()
        .domain([this.getMin(), this.getMax()])
        .range([this.getHeight() - cs.x.axisHeight, this.getTitleHeight()])

    cs.y.axis = d3.axisLeft().ticks(10, "s").scale(cs.y.scale)

    ds.forEach(t => cs.x.domain.push(t["dim"]));
    ds.forEach((t, i) => cs.x.range.push(((this.getWidth() * i) - this.getTitleHeight()) / ds.length));

    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);

    cs.lineFunction = d3.line()
        .x((d, i) => cs.x.scale(d["dim"]) + cs.y.axisWidth + 5)
        .y(d => cs.y.scale(d["metric"]))

    svgContainer.append('path')
        .datum(ds)
        .attr('fill', 'none')
        .attr('stroke', '#ffab00')
        .attr('stroke-width', 3)
        .attr('d', cs.lineFunction)
        .attr('transform', 'translate(0,0)');
    
    svgContainer.selectAll("g")
        .data(ds)
        .enter().append("g")
        .append("circle")
        .attr("class", this.selector)
        .attr("cx", (d, i) => cs.x.scale(d["dim"]) + cs.y.axisWidth + 5)
        .attr("cy", d => cs.y.scale(d["metric"]))
        .attr("r", 2)
        .on("mouseover", d => {
            this.addTooltip(d, event);
        })
        .on("mouseout", d => {
            this.removeTooltip(d);
    });
    
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = this.getHeight() - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;

    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + "," + cs.y.yOffset + ")").call(cs.y.axis);

};

export default drawChart;