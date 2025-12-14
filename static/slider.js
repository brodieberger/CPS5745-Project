const yearLow = document.getElementById("yearLow");
const yearHigh = document.getElementById("yearHigh");

function updateYearLabels() {
  document.getElementById("yearLowLabel").innerText = yearLow.value;
  document.getElementById("yearHighLabel").innerText = yearHigh.value;
}
yearLow.addEventListener("input", () => {
  if (Number(yearLow.value) > Number(yearHigh.value)) {
    yearLow.value = yearHigh.value;
  }
  updateYearLabels();
});

yearLow.addEventListener("change", () => {
  reloadCharts();
});

yearHigh.addEventListener("input", () => {
  if (Number(yearHigh.value) < Number(yearLow.value)) {
    yearHigh.value = yearLow.value;
  }
  updateYearLabels();
});

yearHigh.addEventListener("change", () => {
  reloadCharts();
});

updateYearLabels();

const platformSelect = document.getElementById("platformSelect");

platformSelect.addEventListener("change", () => {
  reloadCharts();
});

function reloadCharts() {
  const params = new URLSearchParams({
    year_low: yearLow.value,
    year_high: yearHigh.value,
    platform: platformSelect.value
  });

  fetch(`api.php?type=scatter_chart&${params}`)
    .then(r => r.json())
    .then(createScatterChart);

  fetch(`api.php?type=pie_chart&${params}`)
    .then(r => r.json())
    .then(createPieChart);

  fetch(`api.php?type=bar_chart&${params}`)
    .then(r => r.json())
    .then(createBarChart);
}
