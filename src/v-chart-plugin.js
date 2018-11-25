/** 
 *  @fileOverview Chart component containing all of the generic components required for charts
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 */

/* eslint-env browser */
import barChart from './import/barChart';
import vBarChart from './import/vBarChart';
import lineGraph from './import/lineGraph';
import scatterPlot from './import/scatterPlot';
import pieChart from './import/pieChart';
import areaChart from './import/areaChart';
import bubbleChart from './import/bubbleChart';

const d3 = Object.assign({},
  require('d3-selection'));

/**
 *  Chart is the generic component used for any chart type
 *  @namespace
 */
  
const Chart = {
  install(Vue) {
    Vue.component('v-chart', {
      props: ['chartData'],
      data() {
        return {
          selector: `${this.chartData.selector}-${this.chartData.chartType}`,
        };
      },
      methods: {
        /**
         * Generate a new Chart of type chartType
         * @memberOf Chart
         */
        initalizeChart() {
          const cs = this[this.chartData.chartType]('init');
          this.drawTitle();
          this.generateLegend(cs);
        },
        /**
         * Redraw the Chart when the data is recycled
         * @memberOf Chart
         */
        refreshChart() {
          this.clearAxis();
          this[this.chartData.chartType]('refresh');
        },
        /**
         * Redraw the Chart when the data is recycled
         * @memberOf Chart
         */
        drawGrid(cs) {
          if (this.chartData.grid && this.chartData.grid.enabled === true) {
            const grid = {
              x: [],
              y: []
            }
            for (let i = this.header; i < (this.height - this.header) * .80; i += this.gridTicks) {
              grid.y.push(i);
            }
            d3.select(`#${this.chartData.selector}`)
            .selectAll('line.gridLine')
            .data(grid.y).enter()
            .append('line')
            .attr('class', 'gridLine')
            .attr('x1', cs.y.axisWidth)
            .attr('x2', this.width)
            .attr('y1', d => d)
            .attr('y2', d => d)
            .style('stroke', '#D3D3D3')
            .style('stroke-width', 1)
          }
        },
        /**
         * Remove x and y axes
         * @memberOf Chart
         */
        clearAxis() {
          d3.select(`#${this.chartData.selector}`).selectAll('.axis').remove();
        },
        /**
         * Remove all content from the SVG
         * @memberOf Chart
         */
        clearCanvas() {
          d3.select(`#${this.chartData.selector}`).selectAll('*').remove();
        },
        /**
         * Appends title and subtitle to the chart
         * @memberOf Chart
         */
        drawTitle() {
          d3.select(`#${this.chartData.selector}`)
            .append('text')
            .attr('x', this.width / 2)
            .attr('y', this.titleHeight - this.titleHeight * 0.1)
            .style('text-anchor', 'middle')
            .text(this.chartData.title);

          d3.select(`#${this.chartData.selector}`)
            .append('text')
            .attr('x', this.width / 2)
            .attr('y', this.titleHeight - this.titleHeight * 0.1 + this.subtitleHeight)
            .style('text-anchor', 'middle')
            .text(this.chartData.subtitle);
        },
        /**
         * Adds a tooltip to the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         * @param {Object} e event x and y coordinates
         */
        addTooltip(d, e) {
          d3.select(`#${this.chartData.selector}`)
            .append('rect')
            .attr('x', e.offsetX - 5 - 50)
            .attr('y', e.offsetY - 13 - 25)
            .attr('height', '16px')
            .attr('width', '80px')
            .attr('class', 'tt')
            .attr('fill', 'white');

          d3.select(`#${this.chartData.selector}`)
            .append('text')
            .attr('x', e.offsetX - 50)
            .attr('y', e.offsetY - 25)
            .attr('class', 'tt')
            .attr('font-size', '10px')
            .text(`${d.dim}:${d.metric}`);
        },
        /**
         * Removes all tooltips from the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         */
        removeTooltip() {
          d3.select(`#${this.chartData.selector}`)
            .selectAll('.tt').remove();
        },
        /**
         * Override default values 
         * @param {Object} cs configuration of the coordinate systems
         * @param {Object} overrides the additional values that can be used for an object
         * @returns {Object} updated configuration of coordinate system 
         */
        setOverrides(cs, overrides) {
          overrides = overrides || {};
          const keys = Object.keys(cs);
          for (const key of keys)
            Object.assign(cs[key], overrides[key]);
          return cs;
        },
        /**
         * Generate legend if option -legends- defined as true
         * @memberOf Chart
         * @param {Object} cs configuration of the coordinate system
         */
        generateLegend(cs) {
          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            cs.palette.lineFill = (Array.isArray(cs.palette.lineFill)) ? cs.palette.lineFill : new Array(cs.palette.lineFill); 
            cs.palette.fill = (Array.isArray(cs.palette.fill)) ? cs.palette.fill : new Array(cs.palette.fill); 
            this.metric.forEach( (e, i) => {
              d3.select(`#${this.chartData.selector}`)
              .append('text')
              .attr('x', this.width - 60)
              .attr('y', this.height * 0.95 - (i * 15))
              .style('text-anchor', 'middle')
              .text(this.metric[i]);

            d3.select(`#${this.chartData.selector}`)
              .append("g")
              .attr("class", "legends")
              .append("rect")
              .attr('x', this.width - 30)
              .attr('y', this.height * 0.95 - (i * 15) - 10)
              .attr("width", 30)
              .attr("height", 10)
              .style("fill", function () {
              const fill = cs.palette.lineFill[i] || cs.palette.fill[i];
                return fill;
              });
            })
          }
        },
        /**
         * Generate Goal 
         * @memberOf Chart
         * @param {Object} cs configuration of the coordinate system
         */

        generateGoal(cs, svgContainer, shiftAxis, padding) {
          svgContainer.selectAll('line#goal').remove();
          const x1 = shiftAxis ? cs.y.axisWidth: cs.x.scale(this.goal) + padding;
          const x2 = shiftAxis ? 500 : cs.x.scale(this.goal) + padding;
          const y1 = shiftAxis ? cs.y.scale(this.goal) + padding : this.header;
          const y2 = shiftAxis ? cs.y.scale(this.goal) + padding : this.displayHeight - cs.x.axisHeight;
          
          svgContainer.append("line")
            .attr('x1', x1)
            .attr('x2', x2)
            .attr('y1', y1)
            .attr('y2', y2)
            .attr('id', 'goal')
            .style('stroke', '#708090')
            .style('stroke-width', 1)
        },

        ...((typeof barChart !== 'undefined') && { barChart }),
        ...((typeof vBarChart !== 'undefined') && { vBarChart }),
        ...((typeof scatterPlot !== 'undefined') && { scatterPlot }),
        ...((typeof pieChart !== 'undefined') && { pieChart }),
        ...((typeof areaChart !== 'undefined') && { areaChart }),
        ...((typeof lineGraph !== 'undefined') && { lineGraph }),
        ...((typeof bubbleChart !== 'undefined') && { bubbleChart }),
      },
      computed: {
        /**
         * Dataset getter function
         * @memberOf Chart
         * @returns {Object} normalized dataset
         */
        ds() {
          const ds = { metric: [] };
          ds.metric = (Array.isArray(this.chartData.metric)) ? ds.metric = this.chartData.metric : new Array(this.chartData.metric);
          ds.dim = this.chartData.dim;
          ds.data = this.chartData.data;
          return ds.data.map((d) => {
            const td = { metric: [] };
            if (!ds.metric[0])
              td.metric[0] = d || 0;
            else {
              ds.metric.forEach(function(e, i){
                td.metric[i] = d[e] || 0;
              })
            }
            td.dim = this.chartData.dim ? d[this.chartData.dim] : null;
            return td;
          });
        },
        /**
         * Goal getter function
         * @memberOf Chart
         * @returns {number} Goal 
         */
        goal() {
          return this.chartData.goal;
        },
        /**
         * Metric getter function
         * @memberOf Chart
         * @returns {array} Metrics 
         */
        metric() {
          const metric = (Array.isArray(this.chartData.metric)) ? this.chartData.metric : new Array(this.chartData.metric);
          return metric;
        },
        /**
         * Height getter function
         * @memberOf Chart
         * @returns {number} Chart Height
         */
        height() {
          return this.chartData.height || 200;
        },
        /**
         * Width getter function
         * @memberOf Chart
         * @returns {number} Chart width
         */
        width() {
          return this.chartData.width || 200;
        },
        /**
         * Grid Tick getter function
         * @memberOf Chart
         * @returns {number} gridTicks 
         */
        gridTicks() {
          if (this.chartData.grid && this.chartData.grid.gridTicks != null) {
            return this.chartData.grid.gridTicks;
          }
          return 100;
        },
        /**
         * Get the maxium value for metric
         * @memberOf Chart
         * @returns {number} Max value for metric
         */
        max() {
          let max = 0;
          var results = []; 
          this.ds.forEach(e => {
            results = results.concat([...e.metric]);
          });
          results.forEach((e) => {
            max = max > e ? max : e;
          });
          return max;
        },
        /**
         * Get the maxium value for triplet
         * @memberOf Chart
         * @returns {Array} Max values for triplet
         */
        maxTriplet() {
          const max = {
            v1: 0,
            v2: 0,
            v3: 0
          };
          this.ds.forEach(e => {
            max.v1 = max.v1 > e.metric[0] ? max.v1 : e.metric[0];
            max.v2 = max.v2 > e.metric[1] ? max.v2 : e.metric[1];
            max.v3 = max.v3 > e.metric[2] ? max.v3 : e.metric[2];
          });
          return max;
        },
        /**
         * Get the minimum value for dataset
         * @memberOf Chart
         * @returns {number} Min value for metric
         */
        min() {
          var results = []; 
          this.ds.forEach(e => {
            results = results.concat([...e.metric]);
          });
          return Math.min(...results.map(o => o));
        },
        /**
         * Get the minimum value for triplet
         * @memberOf Chart
         * @returns {Array} Min values for triplet
         */
        minTriplet() {
          var results = {
            v1: [],
            v2: [],
            v3: []
          };
          this.ds.forEach(e => {
            results.v1.push(e.metric[0])
            results.v2.push(e.metric[1])
            results.v3.push(e.metric[2])
          })
          return {
            v1: (Math.min(...results.v1.map(o => o))),
            v2: (Math.min(...results.v2.map(o => o))),
            v3: (Math.min(...results.v3.map(o => o)))
          };
        },
        /**
         * Gets the height of the dispaly area
         * @memberOf Chart
         * @returns {number} Height of the chart display
         */
        displayHeight() {
          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            return this.height * .80;
          } else {
            return this.height;
          }
        },
        /**
         * Gets the height of the title 
         * @memberOf Chart
         * @returns {number} Height of the chart title
         */
        titleHeight() {
          if (this.chartData.title) return this.chartData.textHeight || 25;
          return 0;
        },
        /**
         * Gets the subtitle height
         * @memberOf Chart
         * @returns {number} Height of chart subtitle
         */
        subtitleHeight() {
          if (this.chartData.subtitle) return this.chartData.textHeight * 0.66 || 25 * 0.66;
          return 0;
        },
        /**
         * Gets the combined height of the title and subtitle
         * @memberOf Chart
         * @returns {number} Total header height
         */
        header() {
          return (this.titleHeight + this.subtitleHeight);
        },
      },
      mounted() {
        this.initalizeChart();
      },
      watch: {
        chartData: {
          handler() {
            this.refreshChart();
          },
          deep: true,
        },
      },
      template:
        '<svg :id=\'this.chartData.selector\' x=\'5\' y=\'5\' :height=\'this.height + 20\' :width=\'this.width + 20\'> </svg>',
    });
  },
};

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Chart);
}