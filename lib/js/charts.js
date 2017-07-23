//Get unique values in array
Array.prototype.unique = function()
{
	var n = {},r=[];
	for(var i = 0; i < this.length; i++)
	{
		if (!n[this[i]])
		{
			n[this[i]] = true;
			r.push(this[i]);
		}
	}
	return r;
};

//Function to parse data and associate category into list of frequency in bins
// to feed into a circular heat chart
function appendBins(data, category) {
  var category_list = category.unique();
  var bins = [2,4,6,8,10,12,14];
  var categorisedData = {};
  var histogram = d3.layout.histogram().bins(bins);

  //Generate empty array for each category
  for (i=0; i<category_list.length; i++){
    categorisedData[category_list[i]] = [];
  }
  //Append all values from data into right category array
  for (i=0; i<data.length; i++) {
    categorisedData[category[i]].push(data[i]);
  }
  //Get each array into bins
  for (i=0; i<category_list.length; i++){
    categorisedData[category_list[i]] = histogram(categorisedData[category_list[i]]);
  }
  return categorisedData;
}

//Function to flatten categorisedData
function heatmapFlatten (categorisedData) {
	var keys = Object.keys(categorisedData);
	var bins = ["<2 m/s","<4 m/s"," <6 m/s", "<8 m/s","<10 m/s","<12 m/s", "<14 m/s"];
	var output = [];
	//Flatten object into array for heatmap visual
	for (i=0; i<bins.length-1; i++){
		for (j=0; j<keys.length; j++) {
			datum = {'month': keys[j], 'type': bins[i], 'value': categorisedData[keys[j]][i].length};
			output.push(datum);
			//console.log(category_list[j][i])
		}
	}
	return output
}

function loadCircularHeatMap (dataset, dom_element_to_append_to,radial_labels,segment_labels, numSegments) {

    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 600 - margin.left - margin.right;

    var height = width;
    var innerRadius = width/14;
    var segmentHeight = (width - margin.top - margin.bottom - 2*innerRadius )/(2*radial_labels.length)

    var chart = circularHeatChart()
    .innerRadius(innerRadius)
		.numSegments(numSegments)
    .segmentHeight(segmentHeight)
    .range(["white", "#01579b"])
    .radialLabels(radial_labels)
    .segmentLabels(segment_labels);

    chart.accessor(function(d) {return d.value;})

    var svg = d3.select(dom_element_to_append_to)
    .selectAll('svg')
    .data([dataset])
    .enter()
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr("transform",
        "translate(" + ( (width )/2 - (radial_labels.length*segmentHeight + innerRadius)  ) + "," + margin.top + ")")
    .call(chart);

    var tooltip = d3.select(dom_element_to_append_to)
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
    .attr('class', 'value');
    tooltip.append('div')
    .attr('class', 'type');

    svg.selectAll("path")
    .on('mouseover', function(d) {
        tooltip.select('.month').html("<b> Month: " + d.month + "</b>");
        tooltip.select('.type').html("<b> Type: " + d.type + "</b>");
        tooltip.select('.value').html("<b> Value: " + d.value + "</b>");

        //tooltip.style('display', 'block');
        tooltip.style('opacity',2);
    })
    .on('mousemove', function(d) {

        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });
}

function loadFlatHeatmap (data) {
	var margin = {top: 50, right: 50, bottom: 50, left: 50};
	var width = 1000 - margin.left - margin.right;
	var height = width;
	var gridsize = width / (data.hour().length / 24);
	var colorScale = d3.scale.linear()
	     .domain([-1, 0, 1])
	     .range(['blue' , 'yellow', 'red']);

	var svg = d3.select(".heatmap").append("svg")
				.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  			.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var heatMap = svg.selectAll("g")
				.data(data, function(d) {return d;});

	var createHeatmap = heatMap.enter()
				.append("svg:rect")
				.attr("x", function(d) {return gridsize * Math.floor(d.hour()/24)})
				.attr("y", function (d){return gridsize * (h - d.hour())})
				.attr("width", gridsize)
				.attr("height", gridsize)
				.style("fill", function(d) {return colorScale(d.dryBulbTemperature);});
}
