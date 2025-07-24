import { getPortfolio, addToken, deleteToken } from './api.js';
import { renderTable, flashCellClass } from './dom.js';

let portfolio = [];
let pendingDeleteSymbol = null;
const flashQueue = new Set();

async function fetchPortfolio() {
  portfolio = await getPortfolio();
  renderTable(portfolio, flashQueue, handleAmountEdit, showDeleteModal);
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

async function updateToken(symbol, amount) {
  const res = await fetch(`/tokens/${symbol}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });

  if (res.status === 404) {
    alert(`Token '${symbol}' not found. It may have been deleted.`);
  }

  flashQueue.add(symbol.toUpperCase());
  await fetchPortfolio();
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

  try {
    const res = await addToken({ symbol, amount: parsed });
    flashQueue.add(symbol);
  } catch (err) {
  if (err.status === 409) {
    alert(`Token '${symbol}' already exists in your portfolio.`);
  } else {
    alert("Failed to add token.");
  }
}

  await fetchPortfolio();
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

async function confirmDelete() {
  try {
    await deleteToken(pendingDeleteSymbol);
  } catch (err) {
    alert(`Token '${pendingDeleteSymbol}' was already deleted or not found.`);
  }

  cancelDelete();
  fetchPortfolio();
}

// Expose to window if needed by HTML buttons
window.addRow = addRow;
window.cancelDelete = cancelDelete;
window.confirmDelete = confirmDelete;

fetchPortfolio();
