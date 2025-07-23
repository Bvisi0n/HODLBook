let portfolio = [];
let pendingDeleteSymbol = null;

async function fetchPortfolio() {
  const res = await fetch('/portfolio');
  portfolio = await res.json();
  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#portfolioTable tbody");
  tbody.innerHTML = "";

  portfolio.forEach((token, index) => {
    const row = document.createElement("tr");

    const symbolCell = document.createElement("td");
    symbolCell.textContent = token.symbol;
    symbolCell.contentEditable = false;
    row.appendChild(symbolCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = token.amount;
    amountCell.contentEditable = true;
    amountCell.onblur = () => {
      const newAmount = parseFloat(amountCell.textContent);
      if (!isNaN(newAmount)) {
        updateToken(token.symbol, newAmount);
      } else {
        alert("Invalid number");
      }
    };
    row.appendChild(amountCell);

    const actionCell = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "btn btn-danger";
    delBtn.onclick = () => showDeleteModal(token.symbol);
    actionCell.appendChild(delBtn);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });
}

async function updateToken(symbol, amount) {
  await fetch('/update_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, amount })
  });
  await fetchPortfolio();
}

function addRow() {
  const symbol = prompt("Enter token symbol (e.g. BTC):");
  if (!symbol) return;

  const amount = prompt("Enter amount:");
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) {
    alert("Invalid amount");
    return;
  }

  fetch('/add_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, amount: parsed })
  }).then(fetchPortfolio);
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
