<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <h1> Vue.js Data Visualization</h1>
        <p>In which we examine creating a component for Vue in the form of a chart.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm">
        <div v-for="(t, index) in chartData.data">
          <input v-model.number="chartData.data[index].month" >
          <input v-model.number="chartData.data[index].total" type="number" >
        </div>
      </div>
      <div class="col-sm">
        <v-chart v-bind:chartData="chartData"></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
import sales from '../assets/data/sales'

export default {
  name: "example",
  data() {
    return {
      chartData: {
        chartType: "lineGraph",
        selector: "chart",
        title: "Sales by Month",
        width: 400,
        height: 300,
        metric: "total",
        dim: "month",
        data: sales
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.chart-barChart {
  fill: blue;
}
.chart-vBarChart {
  fill: red;
}
</style>
