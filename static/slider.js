const yearLow = document.getElementById("yearLow");
const yearHigh = document.getElementById("yearHigh");
const platformSelect = document.getElementById("platformSelect");
const saveBtn = document.getElementById("saveSettingsBtn");
const saveStatus = document.getElementById("saveStatus");

let dataLoaded = false;
let userLoggedIn = false;

function updateYearLabels() {
  document.getElementById("yearLowLabel").innerText = yearLow.value;
  document.getElementById("yearHighLabel").innerText = yearHigh.value;
}

yearLow.addEventListener("input", () => {
  if (+yearLow.value > +yearHigh.value) {
    yearLow.value = yearHigh.value;
  }
  updateYearLabels();
});

yearHigh.addEventListener("input", () => {
  if (+yearHigh.value < +yearLow.value) {
    yearHigh.value = yearLow.value;
  }
  updateYearLabels();
});

yearLow.addEventListener("change", reloadCharts);
yearHigh.addEventListener("change", reloadCharts);
platformSelect.addEventListener("change", reloadCharts);

function reloadCharts() {
  if (!userLoggedIn) return;

  const params = new URLSearchParams({
    year_low: yearLow.value,
    year_high: yearHigh.value,
    platform: platformSelect.value
  });

  fetch("api.php?type=game_count", { credentials: "same-origin" })
    .then(r => r.json())
    .then(data => {
      document.getElementById("game_number").innerText = data.games;
    });

  fetch(`api.php?type=bar_chart&${params}`, { credentials: "same-origin" })
    .then(r => r.json())
    .then(createBarChart);

  fetch(`api.php?type=pie_chart&${params}`, { credentials: "same-origin" })
    .then(r => r.json())
    .then(createPieChart);

  fetch(`api.php?type=scatter_chart&${params}`, { credentials: "same-origin" })
    .then(r => r.json())
    .then(createScatterChart);

  dataLoaded = true;
  updateSaveButtonState();
}

function updateSaveButtonState() {
  if (!saveBtn) return;
  saveBtn.disabled = !(userLoggedIn && dataLoaded);
}

function loadSavedSettings() {
  fetch("settings.php", { credentials: "same-origin" })
    .then(r => r.json())
    .then(res => {
      if (res.found) {
        yearLow.value = res.slider_low;
        yearHigh.value = res.slider_high;
        platformSelect.value = res.platform;
        updateYearLabels();
      }
    });
}

if (saveBtn) {
  saveBtn.onclick = () => {
    fetch("settings.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        slider_low: yearLow.value,
        slider_high: yearHigh.value,
        platform: platformSelect.value
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          saveStatus.innerText = "Settings saved";
        } else {
          saveStatus.innerText = "Save failed";
        }
      })
      .catch(() => {
        saveStatus.innerText = "Save failed";
      });
  };
}

function onLoginSuccess() {
  userLoggedIn = true;
  loadSavedSettings();
  updateSaveButtonState();
}

function onLogout() {
  userLoggedIn = false;
  dataLoaded = false;
  updateSaveButtonState();
}

updateYearLabels();
