<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <h1> Vue.js Data Visualization</h1>
        <p>In which we examine creating a component for Vue in the form of a chart.</p>
      </div>
    </div>

    <div class="row">
      <div class="form-group col-4">
        <div v-for="(t, index) in sales">
          <label> {{sales[index].month}} 
            <input v-model.number="sales[index].total" type="number" >
          </label>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col-12">
            <v-chart v-bind:chartData="lineGraphData"></v-chart>
          </div>
          <div class="col-6">
            <v-chart v-bind:chartData="areaChartData"></v-chart>
          </div>
          <div class="col-6">
            <v-chart v-bind:chartData="barChartData"></v-chart>
          </div>
          <div class="col-6">
            <v-chart v-bind:chartData="vBarChartData"></v-chart>
          </div>
          <div class="col-6">
            <v-chart v-bind:chartData="pieChartData"></v-chart>
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import sales from "../assets/data/sales";

export default {
  name: "barChartExample",
  data() {
    return {
      sales: sales,
      areaChartData: {
        chartType: "areaChart",
        selector: "areaChart",
        title: "Area Chart",
        width: 300,
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
      barChartData: {
        chartType: "barChart",
        selector: "chart",
        title: "Bar Chart",
        subtitle: "Sales by month",
        width: 300,
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
      lineGraphData: {
        chartType: "lineGraph",
        selector: "lineGraph",
        title: "Line Graph",
        width: 600,
        subtitle: "Sales by month",        
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
      vBarChartData: {
        chartType: "vBarChart",
        selector: "vChart",
        title: "Verticle Bar Chart",
        subtitle: "Sales by month",
        width: 300,
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
      pieChartData: {
        chartType: "pieChart",
        selector: "pieChart",
        title: "Pie Chart",
        subtitle: "Sales by month",
        width: 300,
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style> </style>
