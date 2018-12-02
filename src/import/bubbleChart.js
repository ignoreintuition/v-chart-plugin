/** 
 *  @fileOverview Bubble Chart component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-shape'));
/**
 * Builds a Bubble Chart.
 * @module bubbleChart
 */

const bubbleChart = function chart(mode) {
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
      fill: '#005792',
      stroke: '#d1f4fa',
    },
    x: {
      domain: [],
      range: [],
      axisHeight: 20,
    },
    y: {
      axisWidth: 30,
      ticks: 5,
    },
    r: {
      max: 20,
    }
  };

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} points (svg element) 
   */
  const enter = (points) => {
    points.enter()
      .append('circle')
      .attr('class', this.selector)
      .attr('fill', cs.palette.fill)
      .attr('stroke', cs.palette.stroke)
      .on('mouseover', (d) => {
        this.addTooltip(d, window.event);
      })
      .on('mouseout', (d) => {
        this.removeTooltip(d);
      })
      .attr('r', d =>  cs.r.scale(d.metric[2]))
      .attr('cx', d => cs.x.scale(d.metric[0]) + cs.y.axisWidth + 5) 
      .attr('cy', d => cs.y.scale(d.metric[1]));
    return points;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} points (svg element) 
   */
  const transition = (points) => {
    points.transition()
      .attr('r', d => cs.r.scale(d.metric[2]))
      .attr('cx', d => cs.x.scale(d.metric[0]) + cs.y.axisWidth + 5)
      .attr('cy', d => cs.y.scale(d.metric[1]));
    return points;
  };

  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} points (svg element)
   */
  const exit = (points) => {
    points.exit().remove();
    return points;
  };

  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  const buildScales = cs => {
    cs.y.scale = d3.scaleLinear()
      .domain([this.minTriplet.v2 - cs.r.max, this.maxTriplet.v2 + cs.r.max])
      .range([this.displayHeight - cs.x.axisHeight, this.header]);
    cs.x.scale = d3.scaleLinear()
      .domain([this.minTriplet.v1 - cs.r.max, this.maxTriplet.v1 + cs.r.max])
      .range([0, this.width]);
    cs.r.scale = d3.scaleLinear()
      .domain([this.minTriplet.v3, this.maxTriplet.v3])
      .range([0, cs.r.max]);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  const drawAxis = cs => {
    this.drawGrid(cs);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = this.displayHeight - cs.x.axisHeight;
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.x.xOffset}, ${cs.x.yOffset})`)
      .call(cs.x.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.y.xOffset},${cs.y.yOffset})`)
      .call(cs.y.axis);
  };
  
  const points = svgContainer.selectAll('circle').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);

  buildScales(cs);
  drawAxis(cs);
  enter(points);
  transition(points);
  exit(points);
  
  return cs;
};

export default bubbleChart;
