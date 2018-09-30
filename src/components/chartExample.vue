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
        <div class="form-group " v-for="(t, index) in sales">
          <input class="form-control form-control-sm" v-model.number="sales[index].month" >
          <input class="form-control form-control-sm" v-model.number="sales[index].total" type="number" >
        </div>
      </div>
      <div class="col-sm">
        <v-chart v-bind:chartData="lineGraphData"></v-chart>
      </div>
      <div class="col-sm">
        <v-chart v-bind:chartData="barChartData"></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
import sales from '../assets/data/sales'

export default {
  name: "barChartExample",
  data() {
    return {
      sales: sales,
      barChartData: {
        chartType: "barChart",
        selector: "chart",
        title: "Sales by Month",
        width: 300,
        height: 200,
        metric: "total",
        dim: "month",
        data: sales
      },
      lineGraphData: {
        chartType: "lineGraph",
        selector: "graph",
        title: "Sales by Month",
        width: 300,
        height: 200,
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

.chart-barChart:hover {
	fill: #37386B;
}

.chart-vBarChart {
  fill: red;
}
</style>
