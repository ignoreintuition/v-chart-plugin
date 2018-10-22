var d3 = Object.assign({},
    require('d3-selection'),
    require('d3-scale'),
    require('d3-axis'),
    require('d3-shape')
);
/**
 * Builds an Line Graph.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports lineGraph
 */

var lineGraph = function (mode) {
    let svgContainer = d3.select('#' + this.chartData.selector),
        ds = this.ds,
        cs = {
            pallette: {
                lineFill: '#ffcdcd',
                pointFill: '#005792',
                pointStroke: '#d1f4fa'
            },
            x: {
                domain: [],
                range: [],
                axisHeight: 20
            }, y: {
                axisWidth: 30,
                ticks: 5
            }
        };

    /**
     * @method _enter
     * @description Runs when a new element is added to the dataset
     */
    var _enter = points => {
        svgContainer.append('path')
            .datum(ds)
            .attr('fill', 'none')
            .attr('stroke', cs.pallette.lineFill)
            .attr('stroke-width', 3)
            .attr('d', cs.lineFunction);

        points.enter()
            .append('circle')
            .attr('class', this.selector)
            .attr('r', 2)
            .on('mouseover', d => {
                this.addTooltip(d, event);
            })
            .on('mouseout', d => {
                this.removeTooltip(d);
            }).attr('cx', (d, i) => cs.x.scale(d['dim']) + cs.y.axisWidth + 5)
            .attr('cy', d => cs.y.scale(d['metric']));
        return points;
    };
    /**
     * @method _transition
     * @description Runs when a value of an element in dataset is changed
     */
    var _transition = points => {
        svgContainer
            .selectAll('path')
            .datum(ds)
            .transition()
            .attr('d', cs.lineFunction);

        points.transition()
            .attr('cx', (d, i) => cs.x.scale(d['dim']) + cs.y.axisWidth + 5)
            .attr('cy', d => cs.y.scale(d['metric']))
            .attr('cx', (d, i) => cs.x.scale(d['dim']) + cs.y.axisWidth + 5)
            .attr('cy', d => cs.y.scale(d['metric']))
        return points;
    };

    /**
     * @method _exit
     * @param {Object} rect (svg element)
     * @description Runs when an element is removed from the dataset
     */
    var _exit = points => {
        points.exit().remove();
        return points;
    };
    /**
     * @method _buildScales
     * @param {Object} cs coordinate system configuraton
     * @description builds the scales for the x and y axis
     */
    var _buildScales = cs => {
        cs.y.scale = d3.scaleLinear()
            .domain([this.min, this.max])
            .range([this.height - cs.x.axisHeight, this.header])
        cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale)
        ds.forEach(t => cs.x.domain.push(t['dim']));
        ds.forEach((t, i) => cs.x.range.push(((this.width * i) - this.header) / ds.length));
        cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
        return cs;
    };
    /**
     * @method _drawAxis
     * @param {Object} cs coordinate system configuraton
     * @description draws the x and y axis on the svg
     */
    var _drawAxis = cs => {
        cs.x.axis = d3.axisBottom().scale(cs.x.scale);
        cs.x.xOffset = cs.y.axisWidth + 5;
        cs.x.yOffset = this.height - cs.x.axisHeight;
        cs.y.xOffset = cs.y.axisWidth;
        cs.y.yOffset = 0;
        return cs;
    };
    /**
     * 
     * Helper Functions 
     */
    cs.lineFunction = d3.line()
        .x((d, i) => cs.x.scale(d['dim']) + cs.y.axisWidth + 5)
        .y(d => cs.y.scale(d['metric']))

    let points = svgContainer.selectAll('circle').data(ds);

    _buildScales(cs);
    _drawAxis(cs);
    _enter(points);
    _transition(points);
    _exit(points);

    svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
    svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ',' + cs.y.yOffset + ')').call(cs.y.axis);

};

export default lineGraph;