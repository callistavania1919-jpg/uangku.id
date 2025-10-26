// ======================================================
// 🩷 Uangku.id — Personal Finance Web App (Frontend Only)
// ======================================================

// Ambil data dari LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Ambil elemen penting
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance");

// ======================================================
// 🔹 CHART.JS (Pie Chart Pemasukan vs Pengeluaran)
// ======================================================
const chartScript = document.createElement("script");
chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(chartScript);

let chart;
function updateChart() {
  const ctx = document.getElementById("chart");
  if (!ctx || !window.Chart) return;

  const income = transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Pemasukan 💰", "Pengeluaran 💸"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#2b7a78", "#d9534f"],
        borderWidth: 0
      }]
    },
    options: { plugins: { legend: { position: "bottom" } } }
  });
}

// ======================================================
// 🔹 UPDATE UI (Render transaksi, saldo, dan chart)
// ======================================================
function updateUI() {
  list.innerHTML = "";
  let balance = 0;

  transactions.forEach((t, i) => {
    const li = document.createElement("li");
    li.classList.add("glass", "fade-in");
    li.innerHTML = `
      <span>${t.desc}</span>
      <span>${t.type === "income" ? "+" : "-"} Rp ${t.amount.toLocaleString()}</span>
      <button class="delete" data-index="${i}">❌</button>
    `;
    list.appendChild(li);

    if (t.type === "income") balance += t.amount;
    else balance -= t.amount;
  });

  balanceEl.textContent = "Rp " + balance.toLocaleString();
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateChart(); // 🔸 update grafik setiap kali data berubah
}

// ======================================================
// 🔹 TAMBAH TRANSAKSI
// ======================================================
form.addEventListener("submit", e => {
  e.preventDefault();

  const desc = document.getElementById("desc").value.trim();
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || isNaN(amount)) return;

  const newTransaction = { desc, amount, type };
  transactions.push(newTransaction);

  form.reset();
  updateUI();
});

// ======================================================
// 🔹 HAPUS TRANSAKSI
// ======================================================
list.addEventListener("click", e => {
  if (e.target.classList.contains("delete")) {
    const index = e.target.dataset.index;
    transactions.splice(index, 1);
    updateUI();
  }
});

// ======================================================
// 🌈 Tema Warna & Mode Gelap (disimpan di LocalStorage)
// ======================================================
const themeSelect = document.getElementById("themeSelect");
const darkToggle = document.getElementById("darkToggle");

// baca tema & mode yang tersimpan
const savedTheme = localStorage.getItem("theme") || "green";
const savedDarkMode = localStorage.getItem("darkMode") === "true";

// terapkan tema dan mode awal
document.body.classList.add(savedTheme);
themeSelect.value = savedTheme;
if (savedDarkMode) document.body.classList.add("dark");

// ganti tema warna
themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;

  // hapus semua warna lama
  document.body.classList.remove("green", "pink", "purple", "blue");
  // tambahkan warna baru
  document.body.classList.add(selectedTheme);

  // simpan ke LocalStorage
  localStorage.setItem("theme", selectedTheme);
});

// toggle dark mode
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
});

// ======================================================
// 🚀 Inisialisasi Awal
// ======================================================
document.addEventListener("DOMContentLoaded", updateUI);
