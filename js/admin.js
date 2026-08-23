let globalAwards = [];

document.addEventListener("DOMContentLoaded", async () => {
  let data = localStorage.getItem("usasoc_awards_db");
  globalAwards = data ? JSON.parse(data) : await (await fetch("data/awards.json")).json();
  
  populateSelect();
  renderPreview();
});

function populateSelect() {
  const select = document.getElementById("edit-award-select");
  if (!select) return;
  select.innerHTML = "";
  globalAwards.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.innerText = `${item.num ? '#' + item.num : ''} ${item.name} (${item.status})`;
    select.appendChild(opt);
  });
  loadSelectedAward();
}

function loadSelectedAward() {
  const idx = document.getElementById("edit-award-select").value;
  const item = globalAwards[idx];
  document.getElementById("edit-status").value = item.status;
  document.getElementById("edit-date").value = item.date || "";
  document.getElementById("edit-evidence").value = item.evidence || "";
}

function applyChanges() {
  const idx = document.getElementById("edit-award-select").value;
  globalAwards[idx].status = document.getElementById("edit-status").value;
  globalAwards[idx].date = document.getElementById("edit-date").value;
  globalAwards[idx].evidence = document.getElementById("edit-evidence").value;

  localStorage.setItem("usasoc_awards_db", JSON.stringify(globalAwards));
  
  populateSelect();
  renderPreview();
  alert("Changes saved to live preview!");
}

function renderPreview() {
  const container = document.getElementById("preview-grid");
  if (!container) return;
  container.innerHTML = "";
  globalAwards.forEach(item => {
    const card = document.createElement("div");
    card.className = `award-card ${item.status ? item.status.toLowerCase() : 'unobtained'}`;
    card.innerHTML = `<div class="award-title">${item.name}</div><div class="award-tag">${item.status}</div>`;
    container.appendChild(card);
  });
}
