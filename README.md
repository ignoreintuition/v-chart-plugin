# V CHART PLUGIN
![logo](https://user-images.githubusercontent.com/5210420/46261741-e5ee4800-c4c5-11e8-8a31-e6099fa79acd.jpg)
> A plugin for adding charts to Vue

## PURPOSE

This plugin is designed to allow Vue.js developers to incorporate fully reactive and customizable charts into your applications.  The plugin is built off of the D3.js JavaScript library for manipulating documents based on data.  By binding data from your components you can create complex charts and graphs that respond to changes in your application.  Vue.js lifecycle events will trigger the charts to update and maintain two-way binding between your charts and your data.  By adding in a state management (such as Vuex) you can additionally persist state across an entire application.

V Chart Plugin is built using Vue.js' component architecture.  This will allow the chart to be a first class citizen of your Vue.js application.  Combining multiple charts allows you to create complex dashboards and enable deeper insights into your data.  All aspects of the charts can be configured to allow for full customization of your graphs along with the ability to style the SVG elements using the classes and IDs generated for each individual canvas element.  

By adding additional charts into the import folder and importing them into the v-chart-plugin.js you can include any custom charts to use with Vue.js.  Using the JavaScript API you can hook into the specific methods in the API and create a reusable component that can persist across your application.

[Demo Page](https://resurgencewebdesign.com/v-chart-plugin-demo/)

## USAGE

These instructions are assuming you are using Vue CLI to create your template.  Include the plugin in your main.js:

```JavaScript
import Chart from './v-chart-plugin.js'
Vue.config.productionTip = false
Vue.use(Chart);
```

Within your component you will need to include an object with: title, selector, width, height, and datapoints to pass to the component.  Data can be passed as an array or as an array of objects:

```JavaScript
export default {
  name: 'example',
  data () {
    return {
      chartData: {
        chartType: 'barChart',
        selector: 'chart',
        title: 'Important Data',
        width: 300,
        height: 200,
        data: [120, 140, 70, 90, 110, 65, 210]      
      }
    }
  }
}
```

If passed as an array of objects you will need to define which attribute to use as your metric / dimension

```JavaScript
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
        metric: 'count',
        data: [
          {'count': 120,
           'fruit': 'apples'}, 
          {'count': 250,
           'fruit': 'oranges'}
        ]
      }
    }
  }
}
```
Chart types currently supported:
* barChart: a diagram in which the numerical values of variables are represented by the width of rectangles of equal height.
* vBarChart: a diagram in which the numerical values of variables are represented by the height of rectangles of equal width.
* lineGraph: A line chart or line graph is a type of chart which displays information as a series of data points called 'markers' connected by straight line segments. 
* scatterPlot: a graph in which the values of two variables are plotted along two axes, the pattern of the resulting points revealing any correlation present.

Lastly you will need to add the component and bind your data

```
<v-chart v-bind:chartData="chartData"></v-chart>
```

If you wish to style the components of the chart you can via the selectors:

```html
<style>
  .chart-barChart {
    fill:blue;
  }
</style>
```
![screenshot](https://user-images.githubusercontent.com/5210420/46261930-99f0d280-c4c8-11e8-8354-b13f2e543e91.png)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
