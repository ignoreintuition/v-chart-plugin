import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';
import _Object$assign from 'babel-runtime/core-js/object/assign';
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

var d3 = _Object$assign({}, require('d3-selection'));

/**
 *  Chart is the generic component used for any chart type
 *  @namespace
 */

var Chart = {
  install: function install(Vue) {
    Vue.component('v-chart', {
      props: ['chartData'],
      data: function data() {
        return {
          selector: this.chartData.selector + '-' + this.chartData.chartType
        };
      },

      methods: _extends({
        /**
         * Generate a new Chart of type chartType
         * @memberOf Chart
         */
        initalizeChart: function initalizeChart() {
          var cs = this[this.chartData.chartType]('init');
          this.drawTitle();
          this.generateLegend(cs);
        },

        /**
         * Redraw the Chart when the data is recycled
         * @memberOf Chart
         */
        refreshChart: function refreshChart() {
          this.clearAxis();
          this[this.chartData.chartType]('refresh');
        },

        /**
         * Remove x and y axes
         * @memberOf Chart
         */
        clearAxis: function clearAxis() {
          d3.select('#' + this.chartData.selector).selectAll('.axis').remove();
        },

        /**
         * Remove all content from the SVG
         * @memberOf Chart
         */
        clearCanvas: function clearCanvas() {
          d3.select('#' + this.chartData.selector).selectAll('*').remove();
        },

        /**
         * Appends title and subtitle to the chart
         * @memberOf Chart
         */
        drawTitle: function drawTitle() {
          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1).style('text-anchor', 'middle').text(this.chartData.title);

          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1 + this.subtitleHeight).style('text-anchor', 'middle').text(this.chartData.subtitle);
        },

        /**
         * Adds a tooltip to the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         * @param {Object} e event x and y coordinates
         */
        addTooltip: function addTooltip(d, e) {
          d3.select('#' + this.chartData.selector).append('rect').attr('x', e.layerX - 5 - 50).attr('y', e.layerY - 13 - 25).attr('height', '16px').attr('width', '80px').attr('class', 'tt').attr('fill', 'white');

          d3.select('#' + this.chartData.selector).append('text').attr('x', e.layerX - 50).attr('y', e.layerY - 25).attr('class', 'tt').attr('font-size', '10px').text(d.dim + ':' + d.metric);
        },

        /**
         * Removes all tooltips from the SVG
         * @memberOf Chart
         * @param {Object} d dataset
         */
        removeTooltip: function removeTooltip() {
          d3.select('#' + this.chartData.selector).selectAll('.tt').remove();
        },

        /**
         * Override default values 
         * @param {Object} cs configuration of the coordinate systems
         * @param {Object} overrides the additional values that can be used for an object
         * @returns {Object} updated configuration of coordinate system 
         */
        setOverrides: function setOverrides(cs, overrides) {
          overrides = overrides || {};
          var keys = _Object$keys(cs);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _getIterator(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              _Object$assign(cs[key], overrides[key]);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return cs;
        },

        /**
         * Generate legend if option -legends- defined as true
         * @memberOf Chart
         * @param {Object} cs configuration of the coordinate system
         */
        generateLegend: function generateLegend(cs) {
          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            d3.select('#' + this.chartData.selector).append('text').attr('x', this.width - 60).attr('y', this.height * 0.95).style('text-anchor', 'middle').text(this.chartData.metric[0]);

            d3.select('#' + this.chartData.selector).append("g").attr("class", "legends").append("rect").attr('x', this.width - 30).attr('y', this.height * 0.95 - 10).attr("width", 30).attr("height", 10).style("fill", function () {
              var fill = cs.palette.lineFill || cs.palette.fill;
              return fill;
            });
          }
        }
      }, typeof barChart !== 'undefined' && { barChart: barChart }, typeof vBarChart !== 'undefined' && { vBarChart: vBarChart }, typeof scatterPlot !== 'undefined' && { scatterPlot: scatterPlot }, typeof pieChart !== 'undefined' && { pieChart: pieChart }, typeof areaChart !== 'undefined' && { areaChart: areaChart }, typeof lineGraph !== 'undefined' && { lineGraph: lineGraph }),
      computed: {
        /**
         * Dataset getter function
         * @memberOf Chart
         * @returns {Object} normalized dataset
         */
        ds: function ds() {
          var _this = this;

          //TODO add in support for arrays with undefined metric
          var ds = { metric: [] };
          if (!Array.isArray(this.chartData.metric)) {
            ds.metric.push(this.chartData.metric);
          } else {
            ds.metric = this.chartData.metric;
          }
          ds.dim = this.chartData.dim;
          ds.data = this.chartData.data;

          return ds.data.map(function (d) {
            var td = {
              metric: []
            };
            ds.metric.forEach(function (e, i) {
              td.metric[i] = d[e] || 0;
            });
            td.dim = _this.chartData.dim ? d[_this.chartData.dim] : null;
            return td;
          });
        },

        /**
         * Metric getter function
         * @memberOf Chart
         * @returns {array} Metrics 
         */
        metric: function metric() {
          return this.chartData.metric;
        },

        /**
         * Height getter function
         * @memberOf Chart
         * @returns {number} Chart Height
         */
        height: function height() {
          return this.chartData.height || 200;
        },

        /**
         * Width getter function
         * @memberOf Chart
         * @returns {number} Chart width
         */
        width: function width() {
          return this.chartData.width || 200;
        },

        /**
         * Get the maxium value for metric
         * @memberOf Chart
         * @returns {number} Max value for metric
         */
        max: function max() {
          var max = 0;
          var results = [];
          this.ds.forEach(function (e) {
            results = results.concat([].concat(_toConsumableArray(e.metric)));
          });
          results.forEach(function (e) {
            max = max > e ? max : e;
          });
          return max;
        },

        /**
         * Get the minimum value for dataset
         * @memberOf Chart
         * @returns {number} Min value for metric
         */
        min: function min() {
          var max = 0;
          var results = [];
          this.ds.forEach(function (e) {
            results = results.concat([].concat(_toConsumableArray(e.metric)));
          });
          return Math.min.apply(Math, _toConsumableArray(results.map(function (o) {
            return o;
          })));
        },

        /**
         * Gets the height of the dispaly area
         * @memberOf Chart
         * @returns {number} Height of the chart display
         */
        displayHeight: function displayHeight() {
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
        titleHeight: function titleHeight() {
          if (this.chartData.title) return this.chartData.textHeight || 25;
          return 0;
        },

        /**
         * Gets the subtitle height
         * @memberOf Chart
         * @returns {number} Height of chart subtitle
         */
        subtitleHeight: function subtitleHeight() {
          if (this.chartData.subtitle) return this.chartData.textHeight * 0.66 || 25 * 0.66;
          return 0;
        },

        /**
         * Gets the combined height of the title and subtitle
         * @memberOf Chart
         * @returns {number} Total header height
         */
        header: function header() {
          return this.titleHeight + this.subtitleHeight;
        }
      },
      mounted: function mounted() {
        this.initalizeChart();
      },

      watch: {
        chartData: {
          handler: function handler() {
            this.refreshChart();
          },

          deep: true
        }
      },
      template: '<svg :id=\'this.chartData.selector\' x=\'5\' y=\'5\' :height=\'this.height + 20\' :width=\'this.width + 20\'> </svg>'
    });
  }
};

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Chart);
}