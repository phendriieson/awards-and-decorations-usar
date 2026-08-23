const SUPABASE_URL = 'https://kjejbhcndyczajsnoddr.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZWpiaGNuZHljemFqc25vZGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTgxMjIsImV4cCI6MjEwMzA3NDEyMn0.fL-rmBwnvrBSe_sMT8zKRR8ZeCgaQmdGvLFKv9mHTNQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let globalAwards = [];

async function handleLogin() {
  const email = document.getElementById("admin-email").value.trim();
  const password = document.getElementById("admin-password").value.trim();

  console.log("Attempting login for:", email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Auth Error:", error);
    alert("Authentication Failed: " + error.message);
  } else {
    console.log("Auth Success:", data);
    alert("Terminal Access Granted.");
    document.getElementById("login-container").style.display = "none";
    document.getElementById("editor-container").style.display = "grid";
    loadCloudData();
  }
}

async function loadCloudData() {
  const { data, error } = await supabase.from('awards').select('*').order('id', { ascending: true });
  if (error) {
    console.error("Fetch Error:", error);
    return alert("Failed to fetch awards: " + error.message);
  }
  
  globalAwards = data;
  populateSelect();
  renderPreview();
}

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
  if (!item) return;
  document.getElementById("edit-status").value = item.status;
  document.getElementById("edit-date").value = item.date || "";
  document.getElementById("edit-evidence").value = item.evidence || "";
}

async function saveToDatabase() {
  const idx = document.getElementById("edit-award-select").value;
  const selectedAward = globalAwards[idx];

  const updatedStatus = document.getElementById("edit-status").value;
  const updatedDate = document.getElementById("edit-date").value;
  const updatedEvidence = document.getElementById("edit-evidence").value;

  const { error } = await supabase
    .from('awards')
    .update({ 
      status: updatedStatus, 
      date: updatedDate, 
      evidence: updatedEvidence 
    })
    .eq('id', selectedAward.id);

  if (error) {
    console.error("Update Error:", error);
    alert("Error updating record: " + error.message);
  } else {
    alert("Record updated successfully!");
    loadCloudData();
  }
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
