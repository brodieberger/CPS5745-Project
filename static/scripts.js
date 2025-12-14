function start() {
  fetch("api.php?type=game_count")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("game_number").innerHTML = data.games;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch("api.php?type=bar_chart")
    .then((response) => response.json())
    .then((data) => {
      createBarChart(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch("api.php?type=pie_chart")
    .then((response) => response.json())
    .then((data) => {
      createPieChart(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch("api.php?type=scatter_chart")
    .then((response) => response.json())
    .then((data) => {
      createScatterChart(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}