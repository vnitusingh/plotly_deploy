function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    var metaData = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var metaArray = metaData.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    var metaResult = metaArray[0];
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otu_id => ` OTU ${otu_id} `).reverse();
    
    var config = {responsive: true}
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {size: 20}
      },
      autosize: true,
      height: 400,
      automargin: true,
      xaxis:{linecolor: 'black',
      linewidth: 2,
      mirror: true},
      yaxis:{linecolor: 'black',
      linewidth: 2,
      mirror: true}
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout,config);

    // 1. Create the trace for the bubble chart.
    /*Sets the otu_ids as the x-axis values
    Sets the sample_values as the y-axis values
    Sets the otu_labels as the hover-text values
    Sets the sample_values as the marker size
    Sets the otu_ids as the marker colors
    */
      var desired_maximum_marker_size = 100;
      var bubbleData = [{
      x:otu_ids,
      y:sample_values,
      text:otu_labels,
      mode:'markers', 
      marker:{size:sample_values,
              sizeref: 2.0 * Math.max(...sample_values) / (desired_maximum_marker_size**2),
              sizemode: 'area',
              color:otu_ids,
              colorscale:'Earth',
              opacity:0.7},
      type:"scatter"
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "Bacteria Cultures Per Sample",
        font: {size: 20}
      },
      autosize: true,
      height: 400,
      hovermode:"closest",
      xaxis: {label:'OTU ID'},
      automargin: true
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout,config);
  


    // 4. Create the trace for the gauge chart.
    
    var washing_frequency = metaResult.wfreq;
    
    var gaugeData = [{
        domain: { x:[0,1], y: [0,1]},
        value: washing_frequency,
        title: {
          text: "Belly Button Washing Frequency",
          font: {size: 20}
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10]},
          steps: [
            { range: [0,2], color: "red"},
            { range: [2,4], color: "orange"},
            { range: [4,6], color: "yellow"},
            { range: [6,8], color: "lightgreen"},
            { range: [8,10], color: "green"}
          ],
          bar: {color: "black"}
        }
      }];
  
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 400,
      autosize: true,
      margin: { t: 40, r: 40, l: 40, b: 40 },
      pad:4
    };


    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout,config);

  }
)};