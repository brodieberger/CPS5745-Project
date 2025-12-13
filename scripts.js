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
            createBarChart(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    fetch("api.php?type=pie_chart").then(response => response.json())
        .then(data => {
            createPieChart(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

let barChartInstance = null;
function createBarChart(data) {
  const ctx = document.getElementById("barChart");

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


let pieChartInstance = null;
function createPieChart(data) {
  const ctx = document.getElementById("pieChart");

  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  const labels = data.map(item => item.genre); 
  const values = data.map(item => item.game_count);

  pieChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "# of games having this genre",
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
