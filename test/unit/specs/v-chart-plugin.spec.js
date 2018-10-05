import Vue from 'vue'
import Chart from '@/v-chart-plugin.js'

Vue.use(Chart)

describe('Chart', function () {
  it('renders correctly with different props', function () {
    const Constructor = Vue.extend(Chart)
    const vm = new Vue({
      template: ' <v-chart v-bind:chartData="chartData"></v-chart>',
      data: { chartData: 
        {
          chartType: "barChart",
          selector: "chart",
          title: "Sales by Month",
          width: 300,
          height: 200,
          data: [1,2]
        } 
      }
    }).$mount()
    expect(vm.$el.id).to.equal('chart')
  })
})