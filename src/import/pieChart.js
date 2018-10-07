var d3 = Object.assign({},
  require("d3-selection"),
  require("d3-scale"),
  require("d3-axis"),
  require("d3-shape")
);

var drawChart = function () {
  let ds = this.getData()
  let svgContainer = d3.select("#" + this.chartData.selector),
    cs = {
      radius: null,
      ordinalColors: ['#4D4D4D', '#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0',
        '#B2912F', '#B276B2', '#DECF3F', '#F15854'
      ]
    };

  cs.radius = this.getHeight() > this.getWidth() ? (this.getWidth() - this.getWidth() * 0.1) / 2 : (this.getHeight() - this.getHeight() * 0.1) / 2;

  var pie = d3.pie()
    .sort(null)
    .value(function (ds) {
      return ds["metric"];
    });

  var path = d3.arc()
    .outerRadius(cs.radius - 10)
    .innerRadius(25);

  var arc = svgContainer.selectAll('.arc')
    .data(pie(ds))

  var color = d3.scaleOrdinal()
    .range(cs.ordinalColors)

  arc.enter()
    .append('g')
    .attr('transform', 'translate(' + this.getWidth() / 2 + ',' + this.getHeight() / 2 + ')')
    .append('path')
    .merge(arc)
    .attr('class', 'arc')
    .attr('d', path)
    .attr('fill', function (d, i) {
      return color(i);
    })            
    .on('mouseover', d => {
      this.addTooltip(d.data, event);
    })
    .on('mouseout', d => {
      this.removeTooltip(d);
    })
    .attr('transform', 'translate(0,' + this.getTitleHeight() + ')');



  arc.exit().remove();
  svgContainer.selectAll("g")
    .data(ds)
    .enter().append("g")
};

export default drawChart;