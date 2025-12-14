let barChartInstance = null;
function createBarChart(data) {
  const ctx = document.getElementById("barChart");

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  const labels = data.map((item) => item.year);
  const values = data.map((item) => parseInt(item.count, 10));

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

  const labels = data.map((item) => item.genre);
  const values = data.map((item) => item.game_count);

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
  });
}

/* ---------- Quartile stuff for scatter plot ---------- */

function quartiles(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  return {
    lower: q1 - 1.5 * iqr,
    upper: q3 + 1.5 * iqr,
  };
}

function linearRegression(points) {
  const n = points.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  points.forEach((p) => {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

function regressionLine(points) {
  const { slope, intercept } = linearRegression(points);
  const xs = points.map((p) => p.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  return [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ];
}

/* ---------- Scatter Chart ---------- */
let scatterChartInstance = null;
function createScatterChart(data) {
  const ctx = document.getElementById("scatterChart");

  if (scatterChartInstance) {
    scatterChartInstance.destroy();
  }

  const points = data.map((item) => ({
    x: Number(item.game_count),
    y: Number(item.avg_playtime),
    genre: item.genre,
  }));

  const playtimes = points.map((p) => p.y);
  const bounds = quartiles(playtimes);
  const fitLine = regressionLine(points);

  const pointColors = points.map((p) =>
    p.y < bounds.lower || p.y > bounds.upper ? "yellow" : "blue"
  );

  document.getElementById(
    "outlierInfo"
  ).innerText = `Outliers: avg playtime < ${bounds.lower.toFixed(
    1
  )} minutes or > ${bounds.upper.toFixed(1)} minutes`;

  scatterChartInstance = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Genres",
          data: points,
          pointRadius: 6,
          pointBackgroundColor: pointColors,
        },
        {
          label: "Best Fit Line",
          type: "line",
          data: fitLine,
          borderWidth: 2,
          borderColor: "red",
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const p = context.raw;
              return `${p.genre}: ${p.x} games, ${p.y.toFixed(1)} minutes`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Number of Games (per Genre)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Average Playtime (Minutes)",
          },
        },
      },
    },
  });
}
