# v-chart-plugin

> a plugin for adding charts to Vue

## Usage

First include the plugin in your main.js:

```JavaScript
import Chart from './v-chart-plugin.js'

Vue.config.productionTip = false

Vue.use(Chart);
```

Within your component you will need to include an object in your data for the title and datapoints to pass to the component

```JavaScript
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
```

Lastly you will need to add the component and bind the data to it

```
<v-chart v-bind:chartData="chartData"></v-chart>
```

Currently only supports bar graph for a single metric

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
