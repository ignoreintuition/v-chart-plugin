/** 
 *  @fileOverview Line Graph component definition
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
 * Builds a Line Graph.
 * @module lineGraph
 */

const lineGraph = function chart(mode) {
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
      lineFill: ['#ffcdcd', '#005792'],
      pointFill: '#005792',
      pointStroke: '#d1f4fa',
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
  };

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} points (svg element) 
   */
  const enter = (points, path) => {
    this.metric.forEach( (e, i) => {
      path[i].enter().append('path')
        .attr('d', cs.lineFunction[i](this.ds))
        .attr('fill', 'none')
        .attr('id', 'p' + i)
        .attr('stroke', cs.palette.lineFill[i])
        .attr('stroke-width', 3)
    })    
    this.metric.forEach( (e, i) => {
      cs.offset = i;      
      points[i].enter()
        .append('circle')
        .attr('class', this.selector)
        .attr('class', "r" + i)
        .attr('r', 2)
        .on('mouseover', (d) => {
          this.addTooltip(d, window.event);
        })
        .on('mouseout', (d) => {
          this.removeTooltip(d);
        })
        .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
        .attr('cy', d => cs.y.scale(d.metric));
    });
    if (this.goal) this.generateGoal(cs, svgContainer, true, 0);
    return points;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} points (svg element) 
   */
  const transition = (points, path) => {
    this.metric.forEach( (e, i) => {
      path[i].transition()
      .attr('d', cs.lineFunction[i](this.ds));
    })
  
    this.metric.forEach( (e, i) => {
      cs.offset = i;      
      points[i].transition()
        .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
        .attr('cy', d => cs.y.scale(d.metric))
        .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
        .attr('cy', d => cs.y.scale(d.metric));
    });
    if (this.goal) this.generateGoal(cs, svgContainer, true, 0);
    return points;
  };

  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} points (svg element)
   */
  const exit = (points, path) => {
    this.metric.forEach( (e, i) => {
      points[i].exit().remove();
    });
    this.metric.forEach( (e, i) => {
      path[i].exit().remove();
    });
    return points;
  };

  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  const buildScales = cs => {
    cs.y.scale = d3.scaleLinear()
      .domain([this.min, this.max])
      .range([this.displayHeight - cs.x.axisHeight, this.header]);
    this.ds.forEach(t => cs.x.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.x.range.push(((this.width * i) - this.header) / this.ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  const drawAxis = cs => {
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

  cs.lineFunction = [];
  this.metric.forEach( (e, i) => {
    cs.lineFunction.push( 
      d3.line()
        .x(d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
        .y(d => cs.y.scale(d.metric[i]))
      )  
  });
  
  const points = [];
  this.metric.forEach( (e, i) => {
    points.push(svgContainer.selectAll('circle.r' + i).data(this.ds.map(d => {
      return  {
        metric: d.metric[i],
        dim: d.dim
      }      
    })))
  })

  const path = []
  this.metric.forEach( (e, i) => {
    path.push(svgContainer.selectAll('path#p' + i).data(this.ds))
  })

  cs = this.setOverrides(cs, this.chartData.overrides);

  buildScales(cs);
  drawAxis(cs);
  enter(points, path);
  transition(points, path);
  exit(points, path);

  return cs;
};

export default lineGraph;
