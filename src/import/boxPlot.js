import { globalAgent } from 'http';

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
  require('d3-ease'),
  require('d3-array'));
/**
 * Builds a Box Plot.
 * @module boxPlot
 */

const boxPlot = function chart() {
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
    x: {
      axisHeight: 10,
      ticks: 5,
    },
    y: {
      axisWidth: 10,
      ticks: 5,
    },
  };

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} boxes (svg element)
   */
  const enter = (boxes, lines) => {
    boxes.enter()
      .append('rect')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('class', this.selector)
      .attr('width', 50)
      .attr('height', d => cs.y.scale(d.thirdQrt) - cs.y.scale(d.firstQrt))
      .attr('x', 50)
      .attr('y', d => cs.y.scale(d.firstQrt))
    
    const l = lines.enter()
      
      l.append('line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', 75)
      .attr('y1', d => cs.y.scale(d.min))
      .attr('x2', 75)
      .attr('y2', d => cs.y.scale(d.firstQrt))
    
      l.append('line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', 75)
      .attr('y1', d => cs.y.scale(d.thirdQrt))
      .attr('x2', 75)
      .attr('y2', d => cs.y.scale(d.max))
    
      l.append('line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', 50)
      .attr('y1', d => cs.y.scale(d.median))
      .attr('x2', 100)
      .attr('y2', d => cs.y.scale(d.median))
      
      l.append('line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', 50)
      .attr('y1', d => cs.y.scale(d.min))
      .attr('x2', 100)
      .attr('y2', d => cs.y.scale(d.min))

      l.append('line')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', 50)
      .attr('y1', d => cs.y.scale(d.max))
      .attr('x2', 100)
      .attr('y2', d => cs.y.scale(d.max))
                
    return boxes;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} boxes (svg element)
   */
  const transition = (boxes) => {
    boxes.transition()
    return boxes;
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} boxes (svg element)
   */
  const exit = (rects) => {
    boxes.exit().remove();
    return rects;
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  const buildScales = () => {
    cs.y.scale = d3.scaleLinear()
      .domain([this.min * 0.95, this.max * 1.05])
      .range([this.header, this.displayHeight]);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  const drawAxis = () => {

  };

  const ds = this.metricAsArray('total').sort();
  const a = [{
    min: this.min,
    median: d3.quantile(ds, 0.5),
    max: this.max,
    firstQrt: d3.quantile(ds, 0.25),
    thirdQrt: d3.quantile(ds, 0.75)
  }]

  const boxes = svgContainer.selectAll('rect').data(a);
  const lines = svgContainer.selectAll('line').data(a);

  cs = this.setOverrides(cs, this.chartData.overrides);
  console.log(a)
  buildScales(cs);
  drawAxis(cs);
  enter(boxes, lines);
  transition(boxes, lines);
  exit(boxes, lines);

  return cs;
};

export default boxPlot;
