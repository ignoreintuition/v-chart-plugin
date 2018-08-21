const Chart = {
    install(Vue, options) {
        Vue.chart = function vueChart(data, options = {}) {
            const Chart = {
                title: "This Chart"
            }
            return Chart;
        }

        Vue.directive('chart', {
            bind(el, binding, vnode, oldVnode) {
                const chart = Vue.chart();
                el.innerHTML = chart.title;
            }
        })
    }
}

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyPlugin)
}