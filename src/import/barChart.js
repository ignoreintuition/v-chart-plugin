/** 
 *  @fileOverview Bar chart component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */

 /* eslint-env browser */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-ease'));
/**
 * Builds a Bar Chart.
 * @module barChart
 */

const barChart = function chart() {
  /**
   * The SVG that stores the chart
   * @member svgContainer
   */
  const svgContainer = d3.select(`#${this.chartData.selector}`);
  /**
   * The configuration of the coordinate system
   * @member cs
   */
  let cs = {
    palette: {
      fill: ['#005792', '#ffcdcd'],
      stroke: '#d1f4fa',
    },
    bar: {
      hPadding: 8,
      vPadding: 5,
    },
    x: {
      axisHeight: 10,
      ticks: 5,
    },
    y: {
      domain: [],
      range: [],
      axisWidth: null,
    },
  };

  /**
   * Returns width of the bar
   * @member getWidth
   * @function
   * @param {Object} d (svg element)
   */
  const getWidth = d => cs.x.scale(d);

  /**
   * Returns height of the bar
   * @member getHeight
   * @function
   */
  const getHeight = () => (
    (this.displayHeight - cs.x.axisHeight - this.header - cs.bar.vPadding) / this.ds.length - 1) / this.metric.length ;

  /**
   * Returns y axis co-ordinate of the bar
   * @member getYCoord
   * @function
   * @param {Object} d (svg element)
   * @param {Object} i (svg element)
   */
  const getYCoord = (d, i) => i * (
    this.displayHeight - cs.x.axisHeight - this.header) / this.ds.length + 1 + this.header + cs.bar.offset;

  /**
   * Adds a tooltip on mouse over
   * @member mouseOver
   * @function
   * @param {Object} d (svg element)
   */
  const mouseOver = (d) => {
    this.addTooltip(d, window.event);
  };

  /**
   * Removes tooltip on mouse out
   * @member mouseOut
   * @function
   * @param {Object} d (svg element)
   */
  const mouseOut = (d) => {
    this.removeTooltip(d);
  };
  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} rects (svg element)
   */
  const enter = (rects) => {
    this.metric.forEach( (e, i) => {
      cs.bar.offset = i * getHeight();
      rects[i].enter()
        .append('rect')
        .attr('fill', cs.palette.fill[i])
        .attr('stroke', cs.palette.stroke)
        .attr('class', this.selector)
        .attr('class', 'r0')
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('y', getYCoord)
        .attr('x', cs.y.axisWidth + cs.bar.hPadding)
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);
    });
    return rects;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} rects (svg element)
   */
  const transition = (rects) => {
    this.metric.forEach( (e, i) => {
      cs.bar.offset = i * getHeight();
      rects[i].transition()
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('y', getYCoord)
        .attr('x', cs.y.axisWidth + cs.bar.hPadding);
    });
    return rects;
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} rect (svg element)
   */
  const exit = (rects) => {
    this.metric.forEach( (e, i) => {
      rects[i].exit().remove();
    });
    return rects;
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  const buildScales = () => {
    cs.x.scale = d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width - cs.bar.hPadding - cs.y.axisWidth]);
    this.ds.forEach(t => cs.y.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.y.range.push(((
      this.displayHeight - cs.x.axisHeight - this.header + cs.bar.vPadding) * i) / this.ds.length));
    cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  const drawAxis = () => {
    cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, 's').scale(cs.x.scale);
    cs.y.axis = d3.axisLeft().scale(cs.y.scale);
    cs.x.yOffset = this.displayHeight - cs.x.axisHeight;
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;
    cs.y.yOffset = cs.bar.vPadding + this.header - 1;
    cs.y.xOffset = cs.y.axisWidth;
    if (this.ds[0].dim)
      svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.y.xOffset}, ${cs.y.yOffset})`).call(cs.y.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.x.xOffset}, ${cs.x.yOffset})`).call(cs.x.axis);
  };
  /**
   * Get the maximum dimension length
   * @member getMaxDimLength
   * @function
   * @param {number} accumulator
   * @param {number} currentValue
   */
  const getMaxDimLength = (accumulator, currentValue) => {
    return (currentValue.dim.length > accumulator) ? currentValue.dim.length : accumulator;
  }

  const rects = []
  this.metric.forEach( (e, i) => {
    rects.push(svgContainer.selectAll('rect.r' + i).data(this.ds.map(d => d.metric[i])))
  })

  cs = this.setOverrides(cs, this.chartData.overrides);
  if (this.ds[0].dim)
    cs.y.axisWidth = cs.y.axisWidth || (this.ds.reduce(getMaxDimLength, 0)) * 10;

  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);

  return cs;
};

export default barChart;
