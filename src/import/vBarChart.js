var d3 = Object.assign({},
    require('d3-selection'),
    require('d3-scale'),
    require('d3-axis'),
    require('d3-transition')
);
/**
 * Builds an Verticle Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports vBarChart
 */

var vBarChart = function (mode) {
    let ds = this.ds,
        svgContainer = d3.select('#' + this.chartData.selector),
        cs = {
            pallette: {
                fill: '#005792',
                stroke: '#d1f4fa'
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
            .attr('x',getXCoord)
            .attr('y', getYCoord)
            .on('mouseover',mouseOver)
            .on('mouseout', mouseOut);
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
            .attr('x', getXCoord)
            .attr('y', getYCoord);
    };
    /**
     * @method _exit
     * @param {Object} rect (svg element)
     * @description Runs when an element is removed from the dataset
     */
    var _exit = rects => {
        rects.exit().remove();
    };
    /**
     * @method _buildScales
     * @param {Object} cs coordinate system configuraton
     * @description builds the scales for the x and y axis
     */
    var _buildScales = cs => {
        cs.y.scale = d3.scaleLinear()
            .domain([0, this.max])
            .range([this.height, this.header]);
        ds.forEach((t) => cs.x.domain.push(t['dim']));
        ds.forEach((t, i) => cs.x.range.push(((this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i) / ds.length));
        cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);

    };
    /**
     * @method _drawAxis
     * @param {Object} cs coordinate system configuraton
     * @description draws the x and y axis on the svg
     */
    var _drawAxis = cs => {
        cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
        cs.x.axis = d3.axisBottom().scale(cs.x.scale);
        cs.x.yOffset = this.height;
        cs.x.xOffset = cs.y.axisWidth;
        cs.y.yOffset = 0;
        cs.y.xOffset = cs.y.axisWidth;
        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ', ' + cs.y.yOffset + ')').call(cs.y.axis);
        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
    };
    /**
     * 
     * Helper Functions 
     */

    var getWidth = (d, i) => {
        return ((this.width - cs.y.axisWidth) / this.chartData.data.length - 1);
    };

    var getHeight = (d, i) => {
        return this.height - cs.y.scale(d.metric);
    };

    var getXCoord =  (d, i) => {
        return (i * (this.width - cs.y.axisWidth) / this.chartData.data.length) + cs.y.axisWidth;
    };

    var getYCoord = (d, i) => {
        return cs.y.scale(d.metric);
    };

    var mouseOver =  d => {
        this.addTooltip(d, event);
    };

    var mouseOut = d => {
        this.removeTooltip(d);
    };

    let rects = svgContainer.selectAll('rect').data(ds)

    _buildScales(cs);
    _drawAxis(cs);
    _enter(rects);
    _transition(rects);
    _exit(rects);
};

export default vBarChart;