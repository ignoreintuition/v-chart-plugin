// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Chart from './v-chart-plugin';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Chart);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App: App },
  template: '<App/>'
});