/* eslint-env browser */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-shape'));
/**
 * Builds an Pie Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports pieChart
 */

const pieChart = function chart() {
  const svgContainer = d3.select(`#${this.chartData.selector}`);
  const cs = {
    radius: null,
    ordinalColors: ['#d1f4fa', '#005792', '#ffe6eb', '#ffcdcd'],
  };
  cs.radius = this.height > this.width ? (
    this.width - this.width * 0.1) / 2 : (this.height - this.height * 0.1) / 2;

  const color = d3.scaleOrdinal()
    .range(cs.ordinalColors);

  /**
   * @method getColor
   * @description Returns colors for pie chart
   */
  const getColor = (d, i) => color(i);

  /**
     * @method mouseOver
     * @param {Object} d (svg element)
     * @description Adds a tooltip on mouse over
     */
  const mouseOver = (d) => {
    this.addTooltip(d.data, window.event);
  };

  /**
     * @method mouseOut
     * @param {Object} d (svg element)
     * @description Removes tooltip on mouse out
     */
  const mouseOut = (d) => {
    this.removeTooltip(d);
  };

  const path = d3.arc()
    .outerRadius(cs.radius - 10)
    .innerRadius(25);

  /**
   * @method enter
   * @param {Object} arc (svg element)
   * @description Runs when a new element is added to the dataset
   */
  const enter = (arc) => {
    arc.enter()
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`)
      .append('path')
      .merge(arc)
      .attr('class', 'arc')
      .attr('d', path)
      .attr('fill', getColor)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)
      .attr('transform', `translate(0,${this.header})`);
    return arc;
  };
  /**
    * @method transition
    * @param {Object} arc (svg element)
    * @description Runs when a value of an element in dataset is changed
    */
  const transition = (arc) => {
    arc.transition()
      .attr('d', path)
      .attr('fill', getColor);
    return arc;
  };
  /**
   * @method exit
   * @param {Object} arc (svg element)
   * @description Runs when an element is removed from the dataset
   */
  const exit = (arc) => {
    arc.exit().remove();
    return arc;
  };

  const pie = d3.pie()
    .sort(null)
    .value(d => d.metric);

  const arc = svgContainer.selectAll('.arc')
    .data(pie(this.ds));


  enter(arc);
  transition(arc);
  exit(arc);
};

export default pieChart;
