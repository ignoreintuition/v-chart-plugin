var d3 = Object.assign({},
    require("d3-selection"),
    require("d3-scale"),
    require("d3-axis")
);

var drawChart = function () {
    let ds = this.getData()
    let svgContainer = d3.select("." + this.chartData.selector),
        cs = {
            bar: {
                hPadding: 8,
                vPadding: 5
            }, x: {
                axisHeight: 25
            }, y: {
                domain: [],
                range: [],
                axisWidth: 40
            }
        };

    cs.x.scale = d3.scaleLinear()
        .domain([0, this.getMax()])
        .range([0, this.getWidth() - cs.bar.hPadding - cs.y.axisWidth]);

    ds.forEach((t) => cs.y.domain.push(t['dim']));
    ds.forEach((t, i) => cs.y.range.push(((this.chartData.height - cs.x.axisHeight - this.getTitleHeight() + cs.bar.vPadding) * i) / ds.length));
    cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);

    svgContainer.selectAll("g")
        .data(ds)
        .enter().append("g")
        .append("rect")
        .attr("class", this.selector)
        .attr("width", d => {
            return cs.x.scale(d.metric);
        }).attr("height", (d, i) => {
            return (this.getHeight() - cs.x.axisHeight - this.getTitleHeight() - cs.bar.vPadding) / this.chartData.data.length - 1
        }).attr("y", (d, i) => {
            return i * (this.getHeight() - cs.x.axisHeight - this.getTitleHeight()) / this.chartData.data.length + 1 + this.getTitleHeight();
        }).attr("x", cs.y.axisWidth + cs.bar.hPadding);

    cs.x.axis = d3.axisBottom().ticks(10, "s").scale(cs.x.scale);
    cs.y.axis = d3.axisLeft().scale(cs.y.scale);

    cs.x.yOffset = this.getHeight() - this.getTitleHeight();
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;

    cs.y.yOffset = cs.y.axisWidth - cs.bar.vPadding;
    cs.y.xOffset = 45;


    svgContainer.append("g").attr("transform", "translate(" + cs.y.xOffset + ", " + cs.y.yOffset + ")").call(cs.y.axis);
    svgContainer.append("g").attr("transform", "translate(" + cs.x.xOffset + ", " + cs.x.yOffset + ")").call(cs.x.axis);
};

export default drawChart;