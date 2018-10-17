var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
);

var drawChart = function (mode) {
    let svgContainer = d3.select("#" + this.chartData.selector),
        ds = this.ds,
        cs = {
            x: {
                domain: [],
                range: [],
                axisHeight: 20
            }, y: {
                axisWidth: 30,
                ticks: 5
            }
        };
    cs.y.scale = d3.scaleLinear()
        .domain([this.min, this.max])
        .range([this.height - cs.x.axisHeight, this.header])

    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, "s").scale(cs.y.scale)

    ds.forEach(t => cs.x.domain.push(t["dim"]));
    ds.forEach((t, i) => cs.x.range.push(((this.width * i) - this.header) / ds.length));

    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);

    if (mode == "init") {
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
    }

    if (mode == "refresh") {
        svgContainer.selectAll("circle")
            .data(ds)
            .transition()
            .attr("cx", (d, i) => cs.x.scale(d["dim"]) + cs.y.axisWidth + 5)
            .attr("cy", d => cs.y.scale(d["metric"]));

    }
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = this.height - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;

    svgContainer.append("g").attr("class", "axis").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);
    svgContainer.append("g").attr("class", "axis").attr("transform", "translate(" + cs.y.xOffset + "," + cs.y.yOffset + ")").call(cs.y.axis);

};

export default drawChart;