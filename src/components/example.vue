<template>
  <div class="main">
    <div class="description">
      In which we examine creating a component for Vue in the form of a chart.
    </div>
    <div class="container">
      <div v-for="(t, index) in chartData.data">
        <input v-model.number="chartData.data[index]" type="number" >
      </div>
    </div>
    <div class="container">
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
.container {
  float: left;
  padding: 20px;
}
.main {
  padding-left: 10%;
  padding-right: 10%;
}

</style>
