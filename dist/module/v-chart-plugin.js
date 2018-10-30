import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _extends from 'babel-runtime/helpers/extends';
import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
import barChart from './import/barChart';
import vBarChart from './import/vBarChart';
import lineGraph from './import/lineGraph';
import scatterPlot from './import/scatterPlot';
import pieChart from './import/pieChart';
import areaChart from './import/areaChart';

var d3 = _Object$assign({}, require('d3-selection'));

/** @name v-chart-plugin-module
 * @description This plugin is designed to allow Vue.js developers
 *  to incorporate fully reactive and customizable charts into their
 *  applications. The plugin is built off of the D3.js JavaScript
 *  library for manipulating documents based on data. By binding data
 *  from your components, you can create complex charts and graphs that
 *  respond to changes in your application. Vue.js lifecycle events
 *  will trigger the charts to update and maintain two-way binding
 *  between your charts and your data. By adding in a state management
 *  (such as Vuex) you can additionally persist state across an entire application.
 * @exports Chart
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
                 * @method initalizeChart
                 * @description Generate a new Chart of type chartType
                 */
        initalizeChart: function initalizeChart() {
          this.drawTitle();
          this.generateLegend();
          this[this.chartData.chartType]('init');
        },

        /**
                 * @method refreshChart
                 * @description Redraw the Chart when the data is recycled
                 */
        refreshChart: function refreshChart() {
          this.clearAxis();
          this[this.chartData.chartType]('refresh');
        },

        /**
                 * @method clearAxis
                 * @description Remove x and y axes
                 */
        clearAxis: function clearAxis() {
          d3.select('#' + this.chartData.selector).selectAll('.axis').remove();
        },

        /**
                 * @method clearCanvas
                 * @description Remove all content from the SVG
                 */
        clearCanvas: function clearCanvas() {
          d3.select('#' + this.chartData.selector).selectAll('*').remove();
        },

        /**
                 * @method drawTitle
                 * @description Appends title and subtitle to the chart
                 */
        drawTitle: function drawTitle() {
          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1).style('text-anchor', 'middle').text(this.chartData.title);

          d3.select('#' + this.chartData.selector).append('text').attr('x', this.width / 2).attr('y', this.titleHeight - this.titleHeight * 0.1 + this.subtitleHeight).style('text-anchor', 'middle').text(this.chartData.subtitle);
        },

        /**
                 * @method addTooltip
                 * @param {Object} d dataset
                 * @param {Object} e event x and y coordinates
                 * @description Adds a tooltip to the SVG
                 */
        addTooltip: function addTooltip(d, e) {
          d3.select('#' + this.chartData.selector).append('rect').attr('x', e.layerX - 5 - 50).attr('y', e.layerY - 13 - 25).attr('height', '16px').attr('width', '80px').attr('class', 'tt').attr('fill', 'white');

          d3.select('#' + this.chartData.selector).append('text').attr('x', e.layerX - 50).attr('y', e.layerY - 25).attr('class', 'tt').attr('font-size', '10px').text(d.dim + ':' + d.metric);
        },

        /**
                 * @method removeTooltip
                 * @param {Object} d dataset
                 * @description Removes all tooltips from the SVG
                 */
        removeTooltip: function removeTooltip() {
          d3.select('#' + this.chartData.selector).selectAll('.tt').remove();
        },

        /**
             * @method setOverrides
             * @description override default values 
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
             * @method generateLegend
             * @description generate legend if option -legends- defined as true
             */
        generateLegend: function generateLegend() {
          if (this.chartData.legends && this.chartData.legends.enabled === true) {
            d3.select('#' + this.chartData.selector).append('text').attr('x', this.width - 60).attr('y', this.titleHeight - this.titleHeight * 0.1 - 10).style('text-anchor', 'middle').text(this.chartData.metric);

            d3.select('#' + this.chartData.selector).append("g").attr("class", "legends").append("rect").attr('x', this.width - 30).attr('y', this.titleHeight - this.titleHeight * 0.1 - 20).attr("width", 30).attr("height", 10).style("fill", function () {
              return '#005792';
            });
          }
        }
      }, typeof barChart !== 'undefined' && { barChart: barChart }, typeof vBarChart !== 'undefined' && { vBarChart: vBarChart }, typeof scatterPlot !== 'undefined' && { scatterPlot: scatterPlot }, typeof pieChart !== 'undefined' && { pieChart: pieChart }, typeof areaChart !== 'undefined' && { areaChart: areaChart }, typeof lineGraph !== 'undefined' && { lineGraph: lineGraph }),
      computed: {
        /**
                 * @method ds
                 * @description Computed.
                 * @returns {Object} normalized dataset
                 */
        ds: function ds() {
          var _this = this;

          return this.chartData.data.map(function (d) {
            var td = {};
            td.metric = _this.chartData.metric ? d[_this.chartData.metric] : d;
            td.dim = _this.chartData.dim ? d[_this.chartData.dim] : null;
            return td;
          });
        },

        /**
                 * @method height
                 * @description Computed.
                 * @returns {number} Chart Height
                 */
        height: function height() {
          return this.chartData.height || 200;
        },

        /**
                 * @method width
                 * @description Computed.
                 * @returns {number} Chart width
                 */
        width: function width() {
          return this.chartData.width || 200;
        },

        /**
                 * @method max
                 * @description Computed.
                 * @returns {number} Max value for metric
                 */
        max: function max() {
          var max = 0;
          this.ds.forEach(function (e) {
            max = max > e.metric ? max : e.metric;
          });
          return max;
        },

        /**
                 * @method min
                 * @description Computed.
                 * @returns {number} Min value for metric
                 */
        min: function min() {
          return Math.min.apply(Math, _toConsumableArray(this.ds.map(function (o) {
            return o.metric;
          })));
        },

        /**
                 * @method titleHeight
                 * @description Computed.
                 * @returns {number} Height of the chart title
                 */
        titleHeight: function titleHeight() {
          if (this.chartData.title) return this.chartData.textHeight || 25;
          return 0;
        },

        /**
                 * @method subtitleHeight
                 * @description Computed.
                 * @returns {number} Height of chart subtitle
                 */
        subtitleHeight: function subtitleHeight() {
          if (this.chartData.subtitle) return this.chartData.textHeight * 0.66 || 25 * 0.66;
          return 0;
        },

        /**
                 * @method header
                 * @description Computed.
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