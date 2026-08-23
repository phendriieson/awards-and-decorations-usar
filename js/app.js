const SUPABASE_URL = 'https://kjejbhcndyczajsnoddr.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZWpiaGNuZHljemFqc25vZGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTgxMjIsImV4cCI6MjEwMzA3NDEyMn0.fL-rmBwnvrBSe_sMT8zKRR8ZeCgaQmdGvLFKv9mHTNQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allAwards = [];

document.addEventListener("DOMContentLoaded", () => {
  calculateServiceTime();
  loadAwardsData();
});

// Automatic Service Duration Calculator
function calculateServiceTime() {
  // Set your official start dates here (YYYY-MM-DD)
  const usarStartDate = new Date("2024-09-20");
  const regimentStartDate = new Date("2025-08-05"); 
  const today = new Date();

  const diffUsarDays = Math.floor((today - usarStartDate) / (1000 * 60 * 60 * 24));
  const diffRegimentDays = Math.floor((today - regimentStartDate) / (1000 * 60 * 60 * 24));

  document.getElementById("usar-service").innerText = `${diffUsarDays} Days`;
  document.getElementById("regiment-service").innerText = `${diffRegimentDays} Days`;
}

// Fetch from Supabase Database
async function loadAwardsData() {
  try {
    const { data: awards, error } = await supabase
      .from('awards')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    allAwards = awards;
    renderAwards(allAwards);
  } catch (err) {
    console.error("Error loading awards database:", err);
  }
}

// Categorization Logic
function getCategory(item) {
  const name = item.name.toLowerCase();
  
  if (name.includes('operation') || name.includes('after action report') || name.includes('gamenight') || name.includes('codwii')) {
    return 'Operations';
  }
  if (name.includes('queens') || name.includes('turkish') || name.includes('korea') || name.includes('royal air force') || name.includes('philippines') || name.includes('british army')) {
    return 'Foreign';
  }
  if (name.includes('badge') || name.includes('tab') || name.includes('device') || name.includes('wings') || name.includes('bar') || name.includes('stripe')) {
    return 'Badges';
  }
  return 'Ribbons';
}

function filterCategory(category) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  if (category === 'All') {
    renderAwards(allAwards);
  } else {
    const filtered = allAwards.filter(item => getCategory(item) === category);
    renderAwards(filtered);
  }
}

function renderAwards(awards) {
  const container = document.getElementById("awards-grid");
  const counter = document.getElementById("award-counter");
  if (!container) return;
  
  container.innerHTML = "";
  if (counter) counter.innerText = `${awards.length} Items`;

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
