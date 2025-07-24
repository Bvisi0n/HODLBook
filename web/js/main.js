import { getPortfolio } from './api.js';
import { renderTable, flashCellClass } from './dom.js';
import { registerTableEvents } from './events.js';

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

function showDeleteModal(symbol) {
  pendingDeleteSymbol = symbol;
  window.__pendingDeleteSymbol = symbol; // used by confirmDelete
  document.getElementById("modalTokenName").textContent = symbol;
  document.getElementById("confirmModal").classList.add("active");
}

// Register event handlers
registerTableEvents({
  flashQueue,
  showDeleteModal,
  fetchPortfolio,
  setPendingDeleteSymbol: (val) => pendingDeleteSymbol = val
});

// Initial fetch
fetchPortfolio();
