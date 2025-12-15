const platformSelect = document.getElementById("platformSelect");
const saveBtn = document.getElementById("saveSettingsBtn");
const saveStatus = document.getElementById("saveStatus");
const yearLow = document.getElementById("yearLow");
const yearHigh = document.getElementById("yearHigh");

let dataLoaded = false;
let loggedIn = false;

function onDataLoaded() {
  dataLoaded = true;
  updateSaveButton();
}

function onLoginSuccess() {
  loggedIn = true;
  updateSaveButton();
  loadSavedSettings();
}

function onLogout() {
  loggedIn = false;
  dataLoaded = false;
  updateSaveButton();
}

function updateSaveButton() {
  if (!saveBtn) return;
  saveBtn.disabled = !(dataLoaded && loggedIn);
}

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveStatus.textContent = "Saving...";

    fetch("settings.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        slider_low: yearLow.value,
        slider_high: yearHigh.value,
        platform: document.getElementById("platformSelect").value,
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          saveStatus.textContent = "Saved successfully";
        } else {
          saveStatus.textContent = "Save failed";
        }
      })
      .catch((err) => {
        saveStatus.textContent = "Error saving settings";
        console.error(err);
      });
  });
}

function loadSavedSettings() {
    fetch("settings.php", { credentials: "same-origin" })
        .then(r => r.json())
        .then(res => {
            if (!res.found) return;

            yearLow.value = res.slider_low;
            yearHigh.value = res.slider_high;
            platformSelect.value = res.platform;

            document.getElementById("yearLowLabel").textContent = res.slider_low;
            document.getElementById("yearHighLabel").textContent = res.slider_high;

            reloadCharts();
        });
}
