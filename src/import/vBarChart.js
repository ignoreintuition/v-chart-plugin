/* eslint-env browser */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-transition'));
/**
 * Builds a Verticle Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports vBarChart
 */

const vBarChart = function chart() {
  const svgContainer = d3.select(`#${this.chartData.selector}`);
  let cs = {
    pallette: {
      fill: '#005792',
      stroke: '#d1f4fa',
    },
    bar: {
      hPadding: 0,
      vPadding: 0,
    },
    x: {
      axisHeight: 20,
      domain: [],
      range: [],
    },
    y: {
      axisWidth: 30,
      ticks: 5,
    },
  };
  /**
     * @method getWidth
     * @description Returns width of the bar
     */

  const getWidth = () => ((this.width - cs.y.axisWidth) / this.chartData.data.length - 1);

  /**
     * @method getHeight
     * @param {Object} d (svg element)
     * @description Returns height of the bar
     */
  const getHeight = d => this.height - cs.y.scale(d.metric);

  /**
     * @method getXCoord
     * @param {Object} d (svg element)
     * @param {Object} i (svg element)
     * @description Returns x axis co-ordinate of the bar
     */
  const getXCoord = (d, i) => (
    i * (this.width - cs.y.axisWidth) / this.chartData.data.length) + cs.y.axisWidth;
  /**
     * @method getYCoord
     * @param {Object} d (svg element)
     * @description Returns y axis co-ordinate of the bar
     */
  const getYCoord = d => cs.y.scale(d.metric);

  /**
     * @method mouseOver
     * @param {Object} d (svg element)
     * @description Adds a tooltip on mouse over
     */
  const mouseOver = (d) => {
    this.addTooltip(d, window.event);
  };

  /**
     * @method mouseOut
     * @param {Object} d (svg element)
     * @description Removes tooltip on mouse out
     */
  const mouseOut = (d) => {
    this.removeTooltip(d);
  };

    /**
     * @method enter
     * @param {Object} rects (svg element)
     * @description Runs when a new element is added to the dataset
     */
  const enter = (rects) => {
    rects.enter()
      .append('rect')
      .attr('fill', cs.pallette.fill)
      .attr('stroke', cs.pallette.stroke)
      .attr('class', this.selector)
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('x', getXCoord)
      .attr('y', getYCoord)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);
  };
    /**
     * @method transition
     * @param {Object} rects (svg element)
     * @description Runs when a value of an element in dataset is changed
     */
  const transition = (rects) => {
    rects.transition()
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('x', getXCoord)
      .attr('y', getYCoord);
  };
    /**
     * @method exit
     * @param {Object} rects (svg element)
     * @description Runs when an element is removed from the dataset
     */
  const exit = (rects) => {
    rects.exit().remove();
  };
    /**
     * @method buildScales
     * @description builds the scales for the x and y axes
     */
  const buildScales = () => {
    cs.y.scale = d3.scaleLinear()
      .domain([0, this.max])
      .range([this.height, this.header]);
    this.ds.forEach(t => cs.x.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.x.range.push(((
      this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i) / this.ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
    /**
     * @method drawAxis
     * @description draws the x and y axes on the svg
     */
  const drawAxis = () => {
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.yOffset = this.height;
    cs.x.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    cs.y.xOffset = cs.y.axisWidth;
    svgContainer.append('g').attr('class', 'axis')
      .attr('transform', `translate(${cs.y.xOffset}, ${cs.y.yOffset})`)
      .call(cs.y.axis);
    if (this.ds[0].dim)
      svgContainer.append('g').attr('class', 'axis')
      .attr('transform', `translate(${cs.x.xOffset}, ${cs.x.yOffset})`)
      .call(cs.x.axis);
  };

  const rects = svgContainer.selectAll('rect').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides); 
  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);
};

export default vBarChart;
