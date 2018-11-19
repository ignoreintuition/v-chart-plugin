/** 
 *  @fileOverview Verticle Bar Chart component definition
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
  require('d3-transition'));
/**
 * Builds a Verticle Bar Chart.
 * @module vBarChart
 */

const vBarChart = function chart() {
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
   * Returns width of the bar
   * @member getWidth
   * @function
   */

  const getWidth = () => ((this.width - cs.y.axisWidth) / this.chartData.data.length - 1) / this.metric.length ;

  /**
   * Returns height of the bar
   * @member getHeight
   * @function
   * @param {Object} d (svg element)
   */
  const getHeight = d => this.displayHeight - cs.y.scale(d.metric);

  /**
   * Returns x axis co-ordinate of the bar
   * @member getXCoord
   * @function
   * @param {Object} d (svg element)
   * @param {Object} i (svg element)
   */
  const getXCoord = (d, i) => (
    i * (this.width - cs.y.axisWidth) / this.chartData.data.length) + cs.y.axisWidth + cs.bar.offset * getWidth();
  /**
   * Returns y axis co-ordinate of the bar
   * @member getYCoord
   * @function
   * @param {Object} d (svg element)
   */
  const getYCoord = d => cs.y.scale(d.metric);

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
      cs.bar.offset = i;
      rects[i].enter()
        .append('rect')
        .attr('fill', cs.palette.fill[i])
        .attr('stroke', cs.palette.stroke)
        .attr('class', this.selector)
        .attr('class', 'r' + i)
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('x', getXCoord)
        .attr('y', getYCoord)
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);
    });
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} rects (svg element)
   */
  const transition = (rects) => {
    this.metric.forEach( (e, i) => {
      cs.bar.offset = i;
      rects[i].transition()
        .attr('width', getWidth)
        .attr('height', getHeight)
        .attr('x', getXCoord)
        .attr('y', getYCoord);
    });
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} rects (svg element)
   */
  const exit = (rects) => {
    this.metric.forEach( (e, i) => {
      rects[i].exit().remove();
    });
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  const buildScales = () => {
    cs.y.scale = d3.scaleLinear()
      .domain([0, this.max])
      .range([this.displayHeight, this.header]);
    this.ds.forEach(t => cs.x.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.x.range.push(((
      this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i) / this.ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  const drawAxis = () => {
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.yOffset = this.displayHeight;
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

  const rects = []
  this.metric.forEach( (e, i) => {
    rects.push(svgContainer.selectAll('rect.r' + i).data(this.ds.map(d => {
      return  {
        metric: d.metric[i],
        dim: d.dim
      }      
    })))
  })

  cs = this.setOverrides(cs, this.chartData.overrides);
  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);

  return cs;
};

export default vBarChart;
