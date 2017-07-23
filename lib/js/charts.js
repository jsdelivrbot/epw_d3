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

function appendBins(data, category) {
  var category_list = category.unique();
  var bins = [1,2,3,4,5,6,7,8];
  var categorisedData = {};
  var histogram = d3.layout.histogram().bins(bins);
  var output = []
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
  //Flatten object into array for heatmap visual
  for (i=0; i<bins-1; i++){
    for (j=0; j<category_list.length; j++) {
      output.push(categorisedData[category_list[j]][i]);
    }
  }
  return output;
}
