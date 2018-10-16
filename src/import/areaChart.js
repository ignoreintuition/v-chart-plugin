var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis"),
    require("d3-shape")
);

var drawChart = function (mode) {
    let svgContainer = d3.select("#" + this.chartData.selector),
        ds = this.ds,
        cs = {
            pallette: {
                stroke: '#d1f4fa',
                fill:  '#005792'
            },
            x: {
                domain: [],
                range: [],
                axisHeight: 45,
                axisWidth: 45
            }, y: {
                axisWidth: 45
            }
        };
    cs.y.scale = d3.scaleLinear()
        .domain([0, this.max])
        .range([this.height - cs.x.axisHeight, this.titleHeight])

    cs.y.axis = d3.axisLeft().ticks(10, "s").scale(cs.y.scale)

    ds.forEach(t => cs.x.domain.push(t["dim"]));
    ds.forEach((t, i) => cs.x.range.push((((this.width - cs.x.axisWidth) * i)) / ds.length));

    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);

    cs.polyFunction = d3.line()
        .x((d, i) => cs.x.scale(d["dim"]) + cs.y.axisWidth + 5)
        .y(d => cs.y.scale(d["metric"]))

    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = this.height - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    
    svgContainer.selectAll("polygon")
        .data([ds])
        .enter()
        .append('polygon')
        .attr('points', d => {            
            let poly = d.map(function(d) {
                return [cs.x.scale(d["dim"]) + cs.y.axisWidth + 5, cs.y.scale(d["metric"])].join(",");
            }).join(" ");
            poly += (" "+ this.width +", " + cs.x.yOffset   + " ")
            poly += (" " + cs.x.axisHeight + ", " + cs.x.yOffset   + " " )
            return poly;
        })
        .attr("stroke",cs.pallette.stroke)
        .attr("fill",cs.pallette.fill)

    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + "," + cs.y.yOffset + ")").call(cs.y.axis);

};

export default drawChart;