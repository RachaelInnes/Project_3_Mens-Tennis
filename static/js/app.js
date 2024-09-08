// Initialize the map
let map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Build the metadata panel
function buildMetadata(selectedTournamentId) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
        console.log(selectedTournamentId, data);

        let tournament = data.find(meta => meta.TOURNAMENT_ID == selectedTournamentId);
        console.log("Selected Tournament:", tournament);

        let keys = Object.keys(tournament);
        let values = Object.values(tournament);

        let metadataPanel = d3.select("#tournament-metadata");
        metadataPanel.html("");

        for (let i = 0; i < keys.length; i++) {
            metadataPanel.append("div").html(`${keys[i].toUpperCase()}: ${values[i]}`);
        }

        d3.select(".card-header").style("background-color", "steelblue");
        d3.select(".card-title").style("color", "white");
    });
}

// Build the Sunburst Chart
function buildSunburstChart() {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then(data => {
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

// Function to build both charts
function buildCharts(sample) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
        let samples = data.samples;

        function matchId(choice) {
            return choice.id == sample;
        }
        let sampleData = samples.filter(matchId)[0];
        console.log(sampleData);

        let top10samplesValues = sampleData.sample_values.slice(0, 10).reverse();
        let top10otuIds = sampleData.otu_ids.slice(0, 10);
        let top10otuLabels = sampleData.otu_labels.slice(0, 10);

        let trace2 = {
            x: top10otuIds,
            y: top10samplesValues,
            text: top10otuLabels,
            mode: 'markers',
            marker: {
                size: top10samplesValues,
                color: top10otuIds,
                colorscale: 'Viridis'
            }
        };

        let bubbleData = [trace2];

        let layout2 = {
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' },
            margin: {
                l: 50,
                r: 5,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bubble", bubbleData, layout2);

        let trace1 = {
            x: top10samplesValues,
            y: top10otuIds.map(id => `OTU ${id}`),
            text: top10otuLabels,
            type: "bar",
            orientation: "h"
        };

        let barData = [trace1];

        let layout1 = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: { title: 'Number of Bacteria' },
            margin: {
                l: 80,
                r: 0,
                t: 50,
                b: 50
            }
        };

        Plotly.newPlot("bar", barData, layout1);
    });
}

// Function to run on page load
function init() {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
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
        buildCharts(firstTournamentID);
        buildSunburstChart();
        buildMetadata(firstTournamentID);
        updateMap(firstTournamentID);
    });
}

// Function to update the map with winners' nationalities
function updateMap(selectedTournamentId) {
    d3.json("https://raw.githubusercontent.com/RachaelInnes/Project_3_Mens-Tennis/main/updated_main_file.json").then((data) => {
        let tournamentData = data.filter(t => t.TOURNAMENT_ID == selectedTournamentId);
        
        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        tournamentData.forEach(tournament => {
            // Create a marker for each winner's nationality
            let marker = L.marker([tournament.latitude, tournament.longitude])
                .bindPopup(`<b>${tournament.WINNER}</b><br>${tournament.WINNER_NATIONALITY}`)
                .addTo(map);
        });
    });
}

// Function for event listener
function optionChanged(newChoice) {
    console.log("Dropdown Choice:", newChoice);
    buildMetadata(newChoice);
    buildCharts(newChoice);
    updateMap(newChoice);
}

// Initialize the dashboard
init();
