import * as d3 from "d3";

const Chart = {
    install(Vue, options) {
        Vue.component('v-chart', {
            props: ['chartData'], // <-- talk about props
            data: function (){
                return {}
            },
            methods: {
                initalizeChart: function(){
                    drawChart(this.chartData.data);
                },
                refreshChart: function(){
                    d3.select(".chart").selectAll("*").remove();
                    drawChart(this.chartData.data);
              },
            },
            mounted: function(){ // <-- lifecycle events
                this.initalizeChart();
            },
            watch: { // <-- watch functions
                'chartData': {
                    handler: function(val) { 
                        this.refreshChart();
                     },
                    deep: true
                    }
            },
            template: 
                `<svg class="chart"> </svg>`
          })
    }
}
var drawChart = function(chartData){
    let chart = d3.select(".chart");
    let bar = chart.selectAll("g")
    .data(chartData)
    .enter().append("g");
    console.log(d3.select(".chart"));
    bar.append("rect")
    .attr("width", function(d) { 
        return d;	
    }).attr( "height", 10 )
    .attr("y", function(d, i){
        return i * 10 + i
    }).attr( "x", 0 );
}


export default Chart;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(MyPlugin)
}