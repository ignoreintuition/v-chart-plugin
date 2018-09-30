var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let ds = this.getData(),
        svgContainer = d3.select("#" + this.chartData.selector),
        cs = {
            bar: {
                hPadding: 0,
                vPadding: 0,
            },
            x: {
                axisWidth: 50,
                axisHeight: 50,
                domain: [],
                range: [],
            }, y: {
                axisWidth: 45
            }
        };

    cs.y.scale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([this.getHeight() - cs.x.axisHeight, this.getTitleHeight()]);

    ds.forEach((t) => cs.x.domain.push(t['dim']));
    ds.forEach((t, i) => cs.x.range.push(((this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i) / ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);

    svgContainer.selectAll("g")
        .data(ds)
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", (d, i) => {
            return ((this.getWidth() - cs.x.axisWidth) / this.chartData.data.length - 1);
        }).attr("height", (d, i) => {
            return this.getHeight() - cs.y.scale(d.metric) - cs.x.axisHeight;
        }).attr("x", (d, i) => {
            return (i * (this.getWidth() - cs.x.axisWidth) / this.chartData.data.length - 1) + cs.x.axisWidth;
        }).attr("y", (d, i) => {
            return cs.y.scale(d.metric) + this.getTitleHeight();
        }).on("mouseover", d => {
            this.addTooltip(d, event);
        })
        .on("mouseout", d => {
            this.removeTooltip(d);
        });

    cs.y.axis = d3.axisLeft().ticks(10, "s").scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);

    cs.x.yOffset = this.getHeight() - this.getTitleHeight();
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;

    cs.y.yOffset = cs.y.axisWidth - this.getTitleHeight();
    cs.y.xOffset = cs.x.axisWidth;

    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + ", " + cs.y.yOffset + ")").call(cs.y.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);

};

export default drawChart;