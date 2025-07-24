import { addToken, deleteToken } from './api.js';
import { flashCellClass } from './dom.js';

export function registerTableEvents({
  flashQueue,
  showDeleteModal,
  fetchPortfolio,
  setPendingDeleteSymbol
}) {
  window.addRow = async function () {
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
  };

  window.cancelDelete = function () {
    setPendingDeleteSymbol(null);
    document.getElementById("confirmModal").classList.remove("active");
  };

  window.confirmDelete = async function () {
    try {
      await deleteToken(window.__pendingDeleteSymbol);
    } catch (err) {
      alert(`Token '${window.__pendingDeleteSymbol}' was already deleted or not found.`);
    }

    window.cancelDelete();
    fetchPortfolio();
  };
}
