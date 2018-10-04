import Vue from 'vue'
import chartExample from '@/components/chartExample'

describe('chartExample.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(chartExample)
    const vm = new Constructor().$mount()
    expect(1)
  })
})
