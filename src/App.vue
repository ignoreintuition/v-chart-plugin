<template>
  <div id="app">
    <chartExample/>
  </div>
</template>

<script>
import chartExample from './components/chartExample'

export default {
  name: 'App',
  components: {
    chartExample
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
