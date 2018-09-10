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
          <input v-model.number="chartData.data[index]" type="number" >
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
  name: 'example',
  data () {
    return {
      chartData: {
        chartType: "vBarChart",
        selector: "chart",
        title: "Important Data",
        width: 400,
        height: 200,
        data: [120, 140, 70, 90, 110, 65, 210, 25, 112, 201, 35, 250]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .chart-vBarChart {
    fill:blue;
  }
</style>
