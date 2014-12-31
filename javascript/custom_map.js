var widthMap = 960,
    heightMap = 600;

var widthScale = 900,
    heightScale = 20;

var minYear = 1990,
    maxYear = 2012;

// create year slider and axis for description

$(".slider")
  .attr({min: minYear})
  .attr({max: maxYear})
  .val(minYear);

var svg = d3.select('div.scale').append('svg')
  .attr("width", widthScale)
  .attr("height", heightScale);

var scale = d3.scale.linear().
  domain([minYear, maxYear]).
  range([20, 860]);

var formatAsYear = d3.format(".");

var axis = d3.svg.axis()
  .scale(scale)
  .ticks(maxYear-minYear)
  .tickFormat(formatAsYear);

svg.append('g').call(axis).attr('class', 'x axis')

//define color mapping for map
var color = d3.scale.quantize()
  .domain([0, 100])
  .range([
    "rgb(255,255,217)",
    "rgb(237,248,177)",
    "rgb(199,233,180)",
    "rgb(127,205,187)",
    "rgb(65,182,196)",
    "rgb(29,145,192)",
    "rgb(34,94,168)",
    "rgb(12,44,132)"]);

var projection = d3.geo.mercator()
  .scale(400)
  .center([20, 8.5]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3.select("figure.map").append("svg")
  .attr("width", widthMap)
  .attr("height", heightMap);

d3.csv("data/water_access_rural.csv", function(data) {

  d3.json("data/countries.json", function(json) {

    //Merge Worldbank data and GeoJSON
    for (var i = 0; i < data.length; i++) {
      var dataState = data[i]["Country Code"];
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

d3.select('.slider').on('change', function() {
  d3.selectAll('title').remove();

  var year = $(this).val();
  var map = svg.selectAll("path");

  //set current year in headline according to chosen year in slider
  $(".currentYear").text("in " + year);

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
