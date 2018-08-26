const Chart = {
    install(Vue, options) {
        Vue.chart = function vueChart(data, options = {}) {
            const Chart = {
                title: "",
                data: []
            }
            return Chart;
        }

        Vue.directive('chart', {
            bind(el, binding, vnode, oldVnode) {
                const chart = Vue.chart();
                chart.data = binding.value.data || [];
                chart.title = binding.value.title || "";
                
                var node = document.createElement("div");                 
                var titleNode = document.createTextNode(chart.title);
                node.appendChild(titleNode);                              
                el.appendChild(node);
                chart.data.forEach(function(d){
                    var node = document.createElement("div");                 
                    var dataNode = document.createTextNode(d);
                    node.appendChild(dataNode);                              
                    el.appendChild(node);    
                })
            }
        })
    }
}

export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyPlugin)
}