# v-chart-plugin
![logo](https://user-images.githubusercontent.com/5210420/45592567-6dbd4980-b93f-11e8-8383-f79b730ac2af.png)
> A plugin for adding charts to Vue

## Purpose

This plugin was developed to allow Vue.js developers to add in fully customizable charts to their applications.  By adding the v-chart-plugin component to your page you can easily bind a chart to the data stored in your other vue components.  This will allow the chart to be a first class citizen of your Vue application that is reactive to changes in your data.  Combining multiple charts allows you to create complex dashboards and enable deeper insights into your data.

[Demo Page](https://resurgencewebdesign.com/v-chart-plugin-demo/)

## Usage

First include the plugin in your main.js:

```JavaScript
import Chart from './v-chart-plugin.js'

Vue.config.productionTip = false

Vue.use(Chart);
```

Within your component you will need to include an object in your title, selector, width, height, and datapoints to pass to the component

Data can be passed as an array or as an array of objects:
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
* barChart: horizontal bar chart 
* vBarChart: verticle bar chart
* lineGraph: a single variable line graph (time series)

Lastly you will need to add the component and bind the data to it

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
![screenshot](https://user-images.githubusercontent.com/5210420/45857900-e437be00-bd28-11e8-8f24-d73d6f36008b.png)

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
