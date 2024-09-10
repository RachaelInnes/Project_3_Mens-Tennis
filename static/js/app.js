// Initialize the map
let map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Build the metadata panel
function buildMetadata(selectedTournamentId) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/sql_extract4.json").then((data) => {
        console.log(selectedTournamentId, data);

        let tournament = data.find(meta => meta.TOURNAMENT_ID == selectedTournamentId);
        console.log("Selected Tournament:", tournament);

        const keysToDisplay = [
            "YEAR", "TOURNAMENT", "WINNER", 
            "RUNNER-UP", "WINNER_NATIONALITY", "WINNER_ATP_RANKING",
            "RUNNER-UP_ATP_RANKING", "WINNER_LEFT_OR_RIGHT_HANDED",
            "TOURNAMENT_SURFACE", "nationality",
            "Country"
        ];

        // let keys = Object.keys(tournament);
        // let values = Object.values(tournament);

        let metadataPanel = d3.select("#tournament-metadata");
        metadataPanel.html("");

        for (let i = 0; i < keysToDisplay.length; i++) {
            let key = keysToDisplay[i];
            metadataPanel.append("div").html(`<strong>${key.toUpperCase()}:</strong> ${tournament[key]}`);
        }

        d3.select(".card-header").style("background-color", "steelblue");
        d3.select(".card-title").style("color", "white");
    });
}

// Build the Sunburst Chart
function buildSunburstChart() {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/sql_extract4.json").then(data => {
        console.log('Fetched data:', data);

        const handedness = {};

        for (const item of data) {
            const handednessCategory = item.WINNER_LEFT_OR_RIGHT_HANDED;
            const player = item.WINNER;

            if (handednessCategory && player) {
                if (!handedness[handednessCategory]) {
                    handedness[handednessCategory] = {};
                }
                handedness[handednessCategory][player] = (handedness[handednessCategory][player] || 0) + 1;
            }
        }

        const result = Object.entries(handedness).map(([handednessCategory, players]) => ({
            name: handednessCategory,
            children: Object.entries(players).map(([player, count]) => ({
                name: player,
                value: count
            }))
        }));

        const chart = echarts.init(document.getElementById('sunburst'));

        const option = {
            title: {
                text: 'Which hand is the luckiest?',
                left: 'center',
                top: '0%',
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

        chart.setOption(option);
    });
}

// Aria's Function to build bubble charts
function buildbubleCharts(buble) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/sql_extract4.json").then((data) => {
  
      // Get the samples field and
      let winner = data.WINNER;
      // Get the top 10 winners over the years
      const frequencyMap = data.reduce((acc, obj) => {
        const winnerforall = obj.WINNER;
        acc[winnerforall] = (acc[winnerforall] || 0) + 1;
        return acc;
    }, {});
      sortedItems = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])
      let top10winner = sortedItems.slice(0, 10);
      let index=[];
      let Winnernames = [];
      let Numberofwins = [];
      for (let i = 0; i < top10winner.length; i++) {
        let item = top10winner[i];
        let Winnername = item[0];
        let numberofwin = item[1];
        index.push(i); // Add the current index to the index array
        Winnernames.push(Winnername);
        Numberofwins.push(numberofwin);
      };
      console.log(Winnernames); // Check the order of elements
      console.log(Numberofwins); // Check the order of elements
      console.log(index);
      // Build a Bubble Chart
      let trace2 = {
        x: index,
        y: Numberofwins,
        text:Winnernames,
        mode: 'markers',
        marker: {
          size: Numberofwins,
          color: index,
          colorscale: 'Earth' }
        };
      // Data Array
      let bubbleData = [trace2]
      // Layout object
      let layout2 = {
        title: "Top 10 Winner",
        xaxis: { title: 'Winner index' },
        yaxis: { title: 'Number of wins' },
        margin: {
          l: 50,
          r: 5,
          t: 100,
          b: 100}};
      // Render the Bubble Chart
      Plotly.newPlot("bubble", bubbleData, layout2);
    });
  }



// Function to run on page load
function init() {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/sql_extract4.json").then((data) => {
        console.log("Fetched Data:", data);
        let tournaments = data.map(d => ({ name: d.TOURNAMENT, year: d.YEAR, id: d.TOURNAMENT_ID }));
        console.log("Extracted Tournaments Data:", tournaments);
        let dropdownMenu = d3.select("#selDataset");
        for (let i = 0; i < tournaments.length; i++) {
            dropdownMenu.append("option")
                .text(`${tournaments[i].name} (${tournaments[i].year})`)
                .attr("value", tournaments[i].id);
        }
        let header = d3.select(".card.card-body.bg-light h7");
        header.text("Select Tournament and Year");
        let firstTournamentID = tournaments[0].id;
        console.log("First tournament ID:", firstTournamentID);
        // Build charts and metadata for the first tournament
        buildSunburstChart();
        buildbubleCharts(firstTournamentID);
        buildMetadata(firstTournamentID);
        updateMap(firstTournamentID);
    });
}

// Function to update the map with winners' nationalities
function updateMap(selectedTournamentId) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/sql_extract4.json").then((data) => {
        let tournamentData = data.filter(t => t.TOURNAMENT_ID == selectedTournamentId);
        // Clear existing markers
       // Clear existing markers
       map.eachLayer(layer => {
        if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
        tournamentData.forEach(tournament => {
            // Create a green circle marker for each winner's nationality
            let marker = L.circleMarker([tournament.latitude, tournament.longitude], {
                color: 'green',
                fillColor: '#32CD32', // LimeGreen color
                fillOpacity: 0.5,
                radius: 8
            })
            .bindPopup(`
                <b>${tournament.WINNER}</b><br>
                ${tournament.WINNER_NATIONALITY}
            `)
            .addTo(map);
        });
    });
}

// Function for event listener
function optionChanged(newChoice) {
    console.log("Dropdown Choice:", newChoice);
    buildMetadata(newChoice);
    updateMap(newChoice);
    buildbubleCharts(newChoice);
}

// Initialize the dashboard
init();
