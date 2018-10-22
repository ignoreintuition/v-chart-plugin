var d3 = Object.assign({},
    require('d3-selection'),
    require('d3-scale'),
    require('d3-axis'),
    require('d3-ease')
);
/**
 * Builds an Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports barChart
 */

var barChart = function (mode) {
    let ds = this.ds,
        svgContainer = d3.select('#' + this.chartData.selector),
        cs = {
            pallette: {
                fill: '#005792',
                stroke: '#d1f4fa'
            },
            bar: {
                hPadding: 8,
                vPadding: 5
            }, x: {
                axisHeight: 10,
                ticks: 5
            }, y: {
                domain: [],
                range: [],
                axisWidth: 30
            }
        };

    /**
     * @method _enter
     * @param {Object} rect (svg element)
     * @description Runs when a new element is added to the dataset
     */
    var _enter = rects => {
        rects.enter()
            .append('rect')
            .attr('fill', cs.pallette.fill)
            .attr('stroke', cs.pallette.stroke)
            .attr('class', this.selector)
            .attr('width', getWidth)
            .attr('height', getHeight)
            .attr('y', getYCoord)
            .attr('x', cs.y.axisWidth + cs.bar.hPadding)
            .on('mouseover', mouseOver)
            .on('mouseout', mouseOut);
        return rects;
    };
    /**
     * @method _transition
     * @param {Object} rect (svg element)
     * @description Runs when a value of an element in dataset is changed
     */
    var _transition = rects => {
        rects.transition()
            .attr('width', getWidth)
            .attr('height', getHeight)
            .attr('y', getYCoord)
            .attr('x', cs.y.axisWidth + cs.bar.hPadding)
        return rects;
    };
    /**
     * @method _exit
     * @param {Object} rect (svg element)
     * @description Runs when an element is removed from the dataset
     */
    var _exit = rects => {
        rects.exit().remove();
        return rects;
    };
    /**
     * @method _buildScales
     * @param {Object} cs coordinate system configuraton
     * @description builds the scales for the x and y axis
     */
    var _buildScales = cs => {
        cs.x.scale = d3.scaleLinear()
            .domain([0, this.max])
            .range([0, this.width - cs.bar.hPadding - cs.y.axisWidth]);
        ds.forEach((t) => cs.y.domain.push(t['dim']));
        ds.forEach((t, i) => cs.y.range.push(((this.chartData.height - cs.x.axisHeight - this.header + cs.bar.vPadding) * i) / ds.length));
        cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);
        return cs;
    };
    /**
     * @method _drawAxis
     * @param {Object} cs coordinate system configuraton
     * @description draws the x and y axis on the svg
     */
    var _drawAxis = cs => {
        cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, 's').scale(cs.x.scale);
        cs.y.axis = d3.axisLeft().scale(cs.y.scale);
        cs.x.yOffset = this.height - cs.x.axisHeight;
        cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;
        cs.y.yOffset = cs.bar.vPadding + this.header - 1;
        cs.y.xOffset = cs.y.axisWidth;
        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ', ' + cs.y.yOffset + ')').call(cs.y.axis);
        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
        return cs;
    };
    /**
     * 
     * Helper Functions 
     */
    var getWidth = d => {
        return cs.x.scale(d.metric);
    };

    var getHeight = (d, i) => {
        return (this.height - cs.x.axisHeight - this.header - cs.bar.vPadding) / ds.length - 1
    };

    var getYCoord = (d, i) => {
        return i * (this.height - cs.x.axisHeight - this.header) / ds.length + 1 + this.header;
    };

    var mouseOver = d => {
        this.addTooltip(d, event);
    };

    var mouseOut = d => {
        this.removeTooltip(d);
    };

    let rects = svgContainer.selectAll('rect').data(ds);

    _buildScales(cs);
    _drawAxis(cs);
    _enter(rects);
    _transition(rects);
    _exit(rects);

};

export default barChart;