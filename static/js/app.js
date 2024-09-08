

// Build the metadata panel
function buildMetadata(selectedTournamentId) {
  d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
    console.log(selectedTournamentId, data);

    // Filter with fat arrow method the metadata for the object with the desired tournament number
    let tournament = data.find(meta => meta.TOURNAMENT_ID == selectedTournamentId);
        console.log("Selected Tournament:", tournament);
    
    // Create an array of the selected sample's metadata keys
    let keys = Object.keys(tournament);
    // Create an array of the metadata values
    let values = Object.values(tournament);        
        
    // Use d3 to select the panel with id of `#tournament-metadata`
    let metadataPanel = d3.select("#tournament-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Inside a loop that loops over the arrays, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    for (let i = 0; i < keys.length; i++) { //looping over arrays
      metadataPanel.append("div").html(`${keys[i].toUpperCase()}: ${values[i]}`); //used regex to make uppercase
      // console.log(keys[i]);
      // console.log(values[i]);
    };

    // Update styling of metadata panel
    d3.select(".card-header").style("background-color", "steelblue");
    d3.select(".card-title").style("color", "white");
  });
}

// Cathy's function to build a Sunburst Chart with ECharts library
// Function to build and initialize the sunburst chart
function buildSunburstChart(data) {
  // Fetch data and build the chart
  d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json")
  .then(data => {
    console.log('Fetched data:', data);  // Log the fetched data

  // Group data by handedness and count occurrences
  const handedness = {};

  // Loop through data and process each item
  for (const item of Object.values(data)) {
    const handednessCategory = item.WINNER_LEFT_OR_RIGHT_HANDED;
    const player = item.WINNER;

    if (handednessCategory && player) {
      if (!handedness[handednessCategory]) {
        handedness[handednessCategory] = {};
      }
      handedness[handednessCategory][player] = (handedness[handednessCategory][player] || 0) + 1;
    }
  }

  // Convert to the format expected by ECharts
  const result = Object.entries(handedness).map(([handednessCategory, players]) => ({
    name: handednessCategory,
    children: Object.entries(players).map(([player, count]) => ({
      name: player,
      value: count
    }))
  }));

  // Initialize ECharts
  const chart = echarts.init(document.getElementById('sunburst'));

  // Specify chart configuration
  const option = {
    title: {
      text: 'Which hand is the luckiest?',
      left: 'center',
      top: '0%',  // Adjust this value to add space between the title and the chart
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} wins'
    },
    series: [
      {
        type: 'sunburst',
        data: result,
        radius: [0, '94%'],
        label: {
          show: true,
          formatter: '{b|{b}}',
          rich: {
            b: {
              color: '#fff',
              fontSize: 12
            }
          }
        },  
        center: ['50%', '53%']
      }
    ]
  };

  // Use the specified configuration
  chart.setOption(option);
  })
}







// function to build both charts
function buildCharts(sample) {
  d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {

    // Get the samples field and
    let samples = data.samples;
    
    // Filter (with custom function) the samples for the object with the desired sample number
    function matchId(choice) {
    return choice.id == sample;
    }  
    let sampleData = samples.filter(matchId)[0];
    console.log(sampleData);

    // Get the otu_ids, otu_labels, and sample_values
    let top10samplesValues = sampleData.sample_values.slice(0, 10).reverse();
    let top10otuIds = sampleData.otu_ids.slice(0, 10);
    let top10otuLabels = sampleData.otu_labels.slice(0, 10);

    // Build a Bubble Chart
    let trace2 = {
      x: top10otuIds,
      y: top10samplesValues,
      text: top10otuLabels,//hover text
      mode: 'markers',
      marker: {
        size: top10samplesValues,
        color: top10otuIds,
        colorscale: 'Viridis' }
      };

    // Data Array
    let bubbleData = [trace2]

    // Layout object
    let layout2 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      margin: {
        l: 50,
        r: 5,
        t: 100,
        b: 100}};

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, layout2);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let trace1 = {
      x: top10samplesValues,
      y: top10otuIds.map(id => `OTU ${id} `),
      text: top10otuLabels, //hover text
      type: "bar",
      orientation: "h"};

    // Data Array
    let barData = [trace1];

    // Layout object
    let layout1 = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Number of Bacteria' },

      margin: {
        l: 80,
        r: 0,
        t: 50,
        b: 50}};

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, layout1);
  });
}

// Function to run on page load
function init() {
  d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
    console.log("Fetched Data:", data);
    // Extract unique tournaments and years and add to an array 
    let tournaments = data.map(d => ({ name: d.TOURNAMENT, year: d.YEAR, id: d.TOURNAMENT_ID }));
    console.log("Extracted Tournaments Data:", tournaments);
    
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset")

    // Use the list of tournament names and years to populate the select options
    // Inside a loop, use d3 to append a new option for each tournament.
    for (let i = 0; i < tournaments.length; i++) { //looping over array
      dropdownMenu.append("option")
      .text(`${tournaments[i].name}  (${tournaments[i].year})`)
      .attr("value", tournaments[i].id);
    };

    // update text of header of dropdown menu
    let header = d3.select(".card.card-body.bg-light h7");
    header.text("Select Tournament and Year");
    
    // Get the first tournament from the list
    let firstTournamentID = tournaments[0].id;
    console.log("First tournament ID:", firstTournamentID);

    // Build Cathy's chart by calling Sunburst function
    buildSunburstChart();

    // Build metadata panel with the first sample
    buildMetadata(firstTournamentID);
  });
}

  // Function for event listener
  function optionChanged(newChoice) {
    console.log("Dropdown Choice:", newChoice);
    // Build metadata panel each time a new sample is selected

    buildMetadata(newChoice);
  }

// Initialise the dashboard
init()