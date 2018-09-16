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
          <input v-model.number="chartData.data[index].ts" >
          <input v-model.number="chartData.data[index].v" type="number" >
        </div>
      </div>
      <div class="col-sm">
        <v-chart v-bind:chartData="chartData"></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "example",
  data() {
    return {
      chartData: {
        chartType: "lineGraph",
        selector: "chart",
        title: "Important Data",
        width: 400,
        height: 300,
        metric: "v",
        dim: "ts",
        data: [
          {
            ts: "2018-08-16T02:00:39.000Z",
            v: 99
          },
          {
            ts: "2018-08-16T02:05:40.000Z",
            v: 28.22
          },
          {
            ts: "2018-08-16T02:15:42.000Z",
            v: 29.2
          },
          {
            ts: "2018-08-16T02:20:43.000Z",
            v: 29.18
          }
        ]
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
</style>
