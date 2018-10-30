import Vue from 'vue'
import Chart from '@/v-chart-plugin.js'

Vue.use(Chart)

describe('Chart', function () {
  const Constructor = Vue.extend(Chart)
  const vm = new Vue({
    template: 
    "<div id='body'>" +
    "  <v-chart v-bind:chartData='barChartData'></v-chart>" + 
    "  <v-chart v-bind:chartData='areaChartData'></v-chart>" + 
    "  <v-chart v-bind:chartData='lineGraphData'></v-chart>" + 
    "  <v-chart v-bind:chartData='pieChartData'></v-chart>" + 
    "  <v-chart v-bind:chartData='scatterPlotData'></v-chart>" + 
    "  <v-chart v-bind:chartData='vBarChartData'></v-chart>" + 
    "</div>"
    ,
    data: { 
      barChartData: 
      {
        chartType: 'barChart',
        selector: 'barChart',
        title: 'Sales by Month',
        width: 300,
        height: 200,
        data: [1,2]
      },
      areaChartData: 
      {
        chartType: 'areaChart',
        selector: 'areaChart',
        title: 'Sales by Month',
        width: 250,
        height: 100,
        data: [{dimension: "dim1", measure: 10}, {dimension: "dim2", measure: 20}]
      },
      lineGraphData: 
      {
        chartType: 'lineGraph',
        selector: 'lineGraph',
        title: 'Sales by Month',
        width: 350,
        height: 250,
        data: [{dimension: "dim1", measure: 10}, {dimension: "dim2", measure: 20}]
      },
      pieChartData: 
      {
        chartType: 'pieChart',
        selector: 'pieChart',
        title: 'Sales by Month',
        width: 350,
        height: 250,
        data: [{dimension: "dim1", measure: 10}, {dimension: "dim2", measure: 20}]
      },
      scatterPlotData: 
      {
        chartType: 'scatterPlot',
        selector: 'scatterPlot',
        title: 'Sales by Month',
        width: 350,
        height: 250,
        data: [{dimension: "dim1", measure: 10}, {dimension: "dim2", measure: 20}]
      },
      vBarChartData: 
      {
        chartType: 'vBarChart',
        selector: 'vBarChart',
        title: 'Sales by Month',
        width: 350,
        height: 250,
        data: [{dimension: "dim1", measure: 10}, {dimension: "dim2", measure: 20}]
      }
    }
  }).$mount()

  it('Barchart renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].id).to.equal('barChart')
  })

  it('Barchart renders correct width', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].width.baseVal.valueAsString).to.equal('320')
  })

  it('Barchart renders correct height', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].height.baseVal.valueAsString).to.equal('220')
  })

  it('Areachart renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[1].id).to.equal('areaChart')
  })

  it('lineGraph renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[2].id).to.equal('lineGraph')
  })

  it('pieChart renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[3].id).to.equal('pieChart')
  })

  it('scatterPlot renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[4].id).to.equal('scatterPlot')
  })

  it('vBarChart renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[5].id).to.equal('vBarChart')
  })

})