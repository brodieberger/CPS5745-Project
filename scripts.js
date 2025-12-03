function start() {
    fetch("api.php?type=game_count").then(response => response.json())
        .then(data => {
            document.getElementById("game_number").innerHTML = data.games;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    fetch("api.php?type=line_chart").then(response => response.json())
        .then(data => {
            console.log(data);
            createChart(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

let barChartInstance = null;
function createChart(data) {
  const ctx = document.getElementById("myChart");

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const labels = data.map(item => item.year); 
  const values = data.map(item => parseInt(item.count, 10));

  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "# of games released per year",
          data: values, 
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}