let portfolio = [];
let pendingDeleteSymbol = null;
const flashQueue = new Set();

async function fetchPortfolio() {
  const res = await fetch('/portfolio');
  portfolio = await res.json();
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#portfolioTable tbody");
  tbody.innerHTML = "";

  portfolio.forEach((token) => {
    const row = buildTokenRow(token);
    tbody.appendChild(row);
  });
}

function buildTokenRow(token) {
  const row = document.createElement("tr");
  row.appendChild(buildSymbolCell(token));
  row.appendChild(buildAmountCell(token));
  row.appendChild(buildDeleteCell(token));
  return row;
}

function buildSymbolCell(token) {
  const cell = document.createElement("td");
  cell.textContent = token.symbol;
  cell.contentEditable = false;
  return cell;
}

function buildAmountCell(token) {
  const cell = document.createElement("td");
  cell.textContent = token.amount;
  cell.contentEditable = true;
  cell.dataset.original = token.amount;

  if (flashQueue.has(token.symbol)) {
    flashCellClass(cell, "success");
    flashQueue.delete(token.symbol);
  }

  cell.onblur = () => handleAmountEdit(cell, token);
  return cell;
}

function handleAmountEdit(cell, token) {
  const raw = cell.textContent.trim();
  const result = parseAndValidateAmount(raw);

  if (!result.valid) {
    cell.textContent = token.amount;
    flashCellClass(cell, "error");
    return;
  }

  const newAmount = result.value;
  const original = parseFloat(cell.dataset.original);
  if (newAmount !== original) {
    updateToken(token.symbol, newAmount);
    cell.dataset.original = newAmount;
    flashQueue.add(token.symbol);
  }
}

function parseAndValidateAmount(raw) {
  if (!raw) raw = "0";
  if (/\n/.test(raw) || isNaN(raw)) return { valid: false, reason: "NaN" };

  const parsed = parseFloat(raw);
  if (parsed < 0) return { valid: false, reason: "negative" };

  return { valid: true, value: parsed };
}

function buildDeleteCell(token) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.textContent = "Delete";
  button.className = "btn btn-danger";
  button.onclick = () => showDeleteModal(token.symbol);
  cell.appendChild(button);
  return cell;
}

function flashCellClass(cell, className) {
  console.log(`⚡ flashCellClass: Applying '${className}' to cell with value '${cell.textContent}'`);

  cell.classList.remove(className);
  void cell.offsetWidth; // force reflow
  cell.classList.add(className);

  setTimeout(() => {
    cell.classList.remove(className);
    console.log(`⚡ flashCellClass: Removed '${className}' from cell`);
  }, 1000);
}

async function updateToken(symbol, amount) {
  await fetch('/update_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, amount })
  });

  flashQueue.add(symbol.toUpperCase());
  fetchPortfolio();
}

async function addRow() {
  let symbol = prompt("Enter token symbol (e.g. BTC):");
  if (!symbol) return;

  symbol = symbol.trim().toUpperCase();

  let amount = prompt("Enter amount:");
  if (amount === null) return;
  amount = amount.trim();

  if (!amount) amount = "0";

  if (/\n/.test(amount) || isNaN(amount)) {
    alert("Invalid amount. Must be a number with no newlines or letters.");
    return;
  }

  const parsed = parseFloat(amount);
  if (parsed < 0) {
    alert("Amount cannot be negative.");
    return;
  }

  const res = await fetch('/add_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, amount: parsed })
  });

  if (res.status === 409) {
    alert(`Token '${symbol}' already exists in your portfolio.`);
    return;
  }

  await fetchPortfolio();
  flashQueue.add(symbol);
}

function showDeleteModal(symbol) {
  pendingDeleteSymbol = symbol;
  document.getElementById("modalTokenName").textContent = symbol;
  document.getElementById("confirmModal").classList.add("active");
}

function cancelDelete() {
  pendingDeleteSymbol = null;
  document.getElementById("confirmModal").classList.remove("active");
}

function confirmDelete() {
  fetch('/delete_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol: pendingDeleteSymbol })
  }).then(() => {
    cancelDelete();
    fetchPortfolio();
  });
}

fetchPortfolio();
