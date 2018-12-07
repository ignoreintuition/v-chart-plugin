<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <img class = "logo" src="../assets/img/logo.png">
        </div>
    </div>

    <div class="row">
      <div class="form-group col-6 col-md-4">
        <div v-for="(t, index) in sales">
            <input v-model.number="sales[index].total" type="number"> 
            <button v-model="sales[index]" type="submit" @click="removeItem(index, $event)"> [-] </button>             
        </div>
        <button v-on:click="newItem"> [+] </button>
      </div>
      <div class="col-6 col-md-8">
        <div class="row">
          <div class="col-12">
            <v-chart v-bind:chartData="lineGraphData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="areaChartData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="bubbleChartData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="vBarChartData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="barChartData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="pieChartData"></v-chart>
          </div>
          <div class="col-12">
            <v-chart v-bind:chartData="scatterPlotData"></v-chart>
          </div>
        </div>  
      </div>
    </div>
    <a href="https://github.com/ignoreintuition/v-chart-plugin"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub"></a>
  </div>
</template>

<script>
import sales from "../assets/data/sales";

export default {
  name: "barChartExample",
  methods: {
    newItem: function() {
      this.sales.push({
        month: null,
        year: null,
        total: null,
        actual: false
      });
    },
    removeItem: function(d, e) {
      e.preventDefault();
      this.sales.splice(d, 1);
    }
  },
  data() {
    return {
      sales: sales,
      areaChartData: {
        chartType: "areaChart",
        selector: "areaChart",
        title: "Area Chart",
        width: 600,
        height: 500,
        metric: ["total"],
        dim: "month",
        data: sales,
        legends: {
          enabled: true,
          height: 25,
          width: 50
        }
      },
      bubbleChartData: {
        chartType: "bubbleChart",
        selector: "bubbleChart",
        title: "Bubble Chart",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        dim: "month",
        metric: ['total', 'forecast', 'yoy'],
        data: sales,
        goal: 500,
      },
      lineGraphData: {
        chartType: "lineGraph",
        selector: "lineGraph",
        title: "Line Graph",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        goal: 600,
        metric: ["total", "forecast"],
        dim: "month",
        data: sales,
        label: true,
        legends: {
          enabled: true,
          height: 25,
          width: 50
        },
        overrides: {
          palette: {
            fill: ["#34495E", "#4fc08d"],
            stroke: "#41B883"
          }
        }
      },
      vBarChartData: {
        chartType: "vBarChart",
        selector: "vChart",
        title: "Bar Chart",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        metric: ["total", "forecast"],
        dim: "month",
        data: sales,
        legends: {
          enabled: true,
          height: 25,
          width: 50
        },
      },
      barChartData: {
        chartType: "barChart",
        selector: "barChart",
        title: "Bar Chart",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        metric: ["total", "forecast"],
        dim: "month",
        data: sales,
        label: true
      },
      pieChartData: {
        chartType: "pieChart",
        selector: "pieChart",
        title: "Pie Chart",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        metric: "total",
        dim: "month",
        data: sales
      },
      scatterPlotData: {
        chartType: "scatterPlot",
        selector: "scatterPlot",
        title: "Scatter Plot",
        subtitle: "Sales by month",
        width: 600,
        height: 500,
        dim: "month",
        metric: ['total', 'forecast'],
        data: sales,
      },
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.logo {
  width: 200px;
}
</style>
