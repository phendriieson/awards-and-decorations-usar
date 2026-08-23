// Database Client Configuration
const SUPABASE_URL = 'https://kjejbhcndyczajsnoddr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqZWpiaGNuZHljemFqc25vZGRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTgxMjIsImV4cCI6MjEwMzA3NDEyMn0.fL-rmBwnvrBSe_sMT8zKRR8ZeCgaQmdGvLFKv9mHTNQ';

// Renamed variable to 'supabaseAdmin' to prevent redeclaration syntax errors
const supabaseAdmin = window.supabaseAdmin || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let globalAwards = [];

// Authenticate Admin User
async function handleLogin() {
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");

  if (!emailInput || !passwordInput) {
    return alert("Input fields not found on page.");
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    return alert("Please enter both email and password.");
  }

  console.log("Attempting authentication for:", email);

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Auth Error:", error);
    alert("Authentication Failed: " + error.message);
  } else {
    console.log("Auth Success:", data);
    alert("Terminal Access Granted.");
    
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("editor-container").classList.remove("hidden");
    
    loadCloudData();
  }
}

// Fetch Awards Data from Supabase
async function loadCloudData() {
  const { data, error } = await supabaseAdmin
    .from('awards')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Fetch Error:", error);
    return alert("Failed to fetch awards: " + error.message);
  }
  
  globalAwards = data;
  populateSelect();
  renderPreview();
}

// Populate the Record Dropdown
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

// Load Details of Selected Record into Form Fields
function loadSelectedAward() {
  const idx = document.getElementById("edit-award-select").value;
  const item = globalAwards[idx];
  if (!item) return;

  document.getElementById("edit-status").value = item.status || "Unobtained";
  document.getElementById("edit-date").value = item.date || "";
  document.getElementById("edit-evidence").value = item.evidence || "";
}

// Update Database Record
async function saveToDatabase() {
  const idx = document.getElementById("edit-award-select").value;
  const selectedAward = globalAwards[idx];

  if (!selectedAward) {
    return alert("No record selected.");
  }

  const updatedStatus = document.getElementById("edit-status").value;
  const updatedDate = document.getElementById("edit-date").value;
  const updatedEvidence = document.getElementById("edit-evidence").value;

  const { error } = await supabaseAdmin
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
    loadCloudData(); // Refresh preview and dropdown list
  }
}

// Render Preview List on Admin Panel
function renderPreview() {
  const container = document.getElementById("preview-grid");
  if (!container) return;

  container.innerHTML = "";
  globalAwards.forEach(item => {
    const card = document.createElement("div");
    const statusClass = item.status === 'Obtained' ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-600 opacity-60';
    
    card.className = `bg-black/50 border border-border p-3 ${statusClass} flex justify-between items-center`;
    card.innerHTML = `
      <div>
        <div class="font-display font-semibold text-xs text-white">${item.num ? '#' + item.num : ''} ${item.name}</div>
        <div class="font-mono text-[10px] text-gray-500">${item.date || 'No Date'}</div>
      </div>
      <div class="font-mono text-[10px] font-bold uppercase text-primary">${item.status}</div>
    `;
    container.appendChild(card);
  });
}
