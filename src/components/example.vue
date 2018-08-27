<template>
  <div class="main">
    <div class="description">
      In which we examine creating a component for Vue in the form of a chart.
    </div>
      <div v-for="(t, index) in chartData.data">
        <input v-model.number="chartData.data[index]" type="number" >
      </div>

    <div>
      <v-chart v-bind:chartData="chartData"></v-chart>
    </div>
  </div>
</template>

<script>
export default {
  name: 'example',
  data () {
    return {
      chartData: {
        title: "This is a test chart",
        data: [100, 50, 75, 90]
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
