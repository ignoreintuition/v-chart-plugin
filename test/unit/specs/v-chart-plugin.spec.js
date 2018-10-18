import Vue from 'vue'
import Chart from '@/v-chart-plugin.js'

Vue.use(Chart)

describe('Chart', function () {
  const Constructor = Vue.extend(Chart)
  const vm = new Vue({
    template: 
    '<div id='body'>' +
    '  <div id='formInput'>' +
    '    <div v-for='(t, index) in chartData.data'>' +
    '      <input class='elementList' v-model.number='chartData.data[index]' type='number' >' +
    '    </div>' + 
    '  </div>' + 
    '  <v-chart v-bind:chartData='chartData'></v-chart>' + 
    '</div>'
    ,
    data: { 
      chartData: 
      {
        chartType: 'barChart',
        selector: 'chart',
        title: 'Sales by Month',
        width: 300,
        height: 200,
        data: [1,2]
      } 
    }
  }).$mount()

  it('renders correct id', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].id).to.equal('chart')
  })

  it('renders correct width', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].width.baseVal.valueAsString).to.equal('320')
  })

  it('renders correct height', function () {
    expect(vm.$el.getElementsByTagName('svg')[0].height.baseVal.valueAsString).to.equal('220')
  })

})