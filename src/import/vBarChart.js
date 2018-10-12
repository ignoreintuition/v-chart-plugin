var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let ds = this.ds,
        svgContainer = d3.select("#" + this.chartData.selector),
        cs = {
            pallette: {
                fill: "#005792",
                stroke: "#d1f4fa"
            },
            bar: {
                hPadding: 0,
                vPadding: 0,
            },
            x: {
                axisHeight: 20,
                domain: [],
                range: [],
            }, y: {
                axisWidth: 30,
                ticks: 5
            }
        };

    cs.y.scale = d3.scaleLinear()
        .domain([0, this.max])
        .range([this.height,this.header]);

    ds.forEach((t) => cs.x.domain.push(t['dim']));
    ds.forEach((t, i) => cs.x.range.push(((this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i) / ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);

    svgContainer.selectAll("g")
        .data(ds)
        .enter().append("g")
        .append("rect")
        .attr("fill", cs.pallette.fill)
        .attr("stroke", cs.pallette.stroke)
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return ((this.width - cs.y.axisWidth) / this.chartData.data.length - 1);
        }).attr("height", (d, i) => {
            return this.height - cs.y.scale(d.metric);
        }).attr("x", (d, i) => {
            return (i * (this.width - cs.y.axisWidth) / this.chartData.data.length ) + cs.y.axisWidth;
        }).attr("y", (d, i) => {
            return cs.y.scale(d.metric);
        }).on("mouseover", d => {
            this.addTooltip(d, event);
        })
        .on("mouseout", d => {
            this.removeTooltip(d);
        });

    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, "s").scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);

    cs.x.yOffset = this.height;
    cs.x.xOffset = cs.y.axisWidth;

    cs.y.yOffset = 0;
    cs.y.xOffset = cs.y.axisWidth;

    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + ", " + cs.y.yOffset + ")").call(cs.y.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);

};

export default drawChart;