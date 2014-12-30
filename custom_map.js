var widthMap = 960,
    heightMap = 600;

var widthScale = 900,
    heightScale = 20;

var minYear = 1990,
    maxYear = 2012;

var legendRectSize = 20;                                  // NEW
var legendSpacing = 4;                                    // NEW

//set min and max year for slider dynamically
$("#yearRange")
  .attr({min: minYear})
  .attr({max: maxYear})
  .val(minYear);

// create year scale svg
var svg = d3.select('div.scale').append('svg')
  .attr("width", widthScale)
  .attr("height", heightScale);

var scale = d3.scale.linear().
  domain([minYear, maxYear]).
  range([20, 860]);
// remove commas from numbers
var formatAsYear = d3.format(".");

var axis = d3.svg.axis()
  .scale(scale)
  .ticks(maxYear-minYear)
  .tickFormat(formatAsYear);

// add a new `<g>` tag to the `<svg>`, then add the axis component to the `<g>`
svg.append('g').call(axis).attr('class', 'x axis')

//define color mapping for map
var color = d3.scale.quantize()
  .range([
    "rgb(255,255,217)",
    "rgb(237,248,177)",
    "rgb(199,233,180)",
    "rgb(127,205,187)",
    "rgb(65,182,196)",
    "rgb(29,145,192)",
    "rgb(34,94,168)",
    "rgb(12,44,132)"]);

  // color domain is static because even the country that has the best
  // water or sanitation for their inhabitants might not provide a 100 percent
  color.domain([0, 100]);

  var projection = d3.geo.mercator()
    .scale(400)
    .center([20, 8.5]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("figure.map").append("svg")
    .attr("width", widthMap)
    .attr("height", heightMap);

  d3.csv("water_access_rural.csv", function(data) {

    d3.json("countries.json", function(json) {

      //Merge the ag. data and GeoJSON
      //Loop through once for each ag. data value
      for (var i = 0; i < data.length; i++) {
        //Grab state name
        var dataState = data[i]["Country Code"];
        //Grab data value, and convert from string to float
        var dataValue = data[i];
        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          //ADM03_A3 is ISOCode 3 for countries
          var jsonState = json.features[j].properties.ADM0_A3;
          if (dataState == jsonState) {
            //Copy the data value into the JSON
            json.features[j].properties.value = dataValue;
            //For whatever reasons are some countries twice in the geojson file
            //Because of that all states need to be filled with data.
          }
        }
      }

      svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "countries")
        .style("fill", function(d) {
          return fillColor(d, minYear);
        })
        .append("title")
        .text(function(d) {
          return tooltip(d, minYear);
        })
      })
  });

  d3.select('#yearRange').on('change', function() {
    d3.selectAll('title').remove();

    var year = $(this).val();
    var map = svg.selectAll("path");

    //set current year in headline according to chosen year in slider
    $(".year").text("in " + year);

    //add tooltip in two step process:
    //first step: append title
    map
      .append("title")
      .text(function(d) {
        return tooltip(d, year);
      })

    //second step: run transition (after a transition it is not possible to append elements)
    map
      .transition()
      .style("fill", function(d) {
        return fillColor(d, year);
      })
  })

  var legend = svg.selectAll('.legend')
    .data(color.range())
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var horz = 2 * legendRectSize;
      var vert = i * height + 380;
      return 'translate(' + horz + ',' + vert + ')';
    });

  legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style("fill", function(d) {
      return d;
    })

  legend.append('text')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) {
      var range = color.invertExtent(d)
      return range[0] + "% - " + range[1] + "%";
    });

  function tooltip(d, year) {
    return d.properties.NAME + ": " + readYearValue(d, year) + "%" + " (" + year + ")";
  }

  function readYearValue(d, year) {
    //not all countries have values for every year
    try {
      return parseFloat(d.properties.value[year]);
    } catch(err) {
      //console.log("Country: " + d.properties.ADM0_A3 + " Year: " + year);
      //console.log("Error readYearValue: " + err);
      return "";
    }
  }

  // find color for value of year
  function fillColor(d, year) {
    var value = readYearValue(d, year);
    if (value) {
      return color(value);
    } else {
      return "#ccc";
    }
  }
