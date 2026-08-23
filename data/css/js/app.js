document.addEventListener("DOMContentLoaded", () => {
  loadAwardsData();
});

async function loadAwardsData() {
  try {
    let data = localStorage.getItem("usasoc_awards_db");
    let awards = data ? JSON.parse(data) : await (await fetch("data/awards.json")).json();
    renderAwards(awards);
  } catch (err) {
    console.error("Error loading awards database:", err);
  }
}

function renderAwards(awards) {
  const container = document.getElementById("awards-grid");
  if (!container) return;
  container.innerHTML = "";

  awards.forEach(item => {
    const card = document.createElement("div");
    card.className = `award-card ${item.status ? item.status.toLowerCase() : 'unobtained'}`;
    card.onclick = () => showEvidence(item);

    const numTag = item.num ? `#${item.num}` : '';
    card.innerHTML = `
      <div class="award-title">${numTag} ${item.name}</div>
      <div class="award-tag" style="color: ${item.status === 'Obtained' ? 'var(--usasoc-status-obtained)' : '#888'}">${item.status}</div>
    `;
    container.appendChild(card);
  });
}

function showEvidence(item) {
  document.getElementById("modal-title").innerText = item.name;
  document.getElementById("modal-status").innerText = item.status;
  document.getElementById("modal-status").style.color = item.status === "Obtained" ? "var(--usasoc-status-obtained)" : "#888";
  document.getElementById("modal-date").innerText = item.date || "N/A";
  document.getElementById("modal-evidence").innerText = item.evidence || "No formal record filed.";
  document.getElementById("evidence-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("evidence-modal").style.display = "none";
}
