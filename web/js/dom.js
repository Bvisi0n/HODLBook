export function renderTable(portfolio, flashQueue, handleAmountEdit, showDeleteModal) {
  const tbody = document.querySelector("#portfolioTable tbody");
  tbody.innerHTML = "";

  portfolio.forEach((token) => {
    const row = buildTokenRow(token, flashQueue, handleAmountEdit, showDeleteModal);
    tbody.appendChild(row);
  });
}

function buildTokenRow(token, flashQueue, handleAmountEdit, showDeleteModal) {
  const row = document.createElement("tr");
  row.appendChild(buildSymbolCell(token));
  row.appendChild(buildAmountCell(token, flashQueue, handleAmountEdit));
  row.appendChild(buildDeleteCell(token, showDeleteModal));
  return row;
}

function buildSymbolCell(token) {
  const cell = document.createElement("td");
  cell.textContent = token.symbol;
  cell.contentEditable = false;
  return cell;
}

function buildAmountCell(token, flashQueue, handleAmountEdit) {
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

function buildDeleteCell(token, showDeleteModal) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.textContent = "Delete";
  button.className = "btn btn-danger";
  button.onclick = () => showDeleteModal(token.symbol);
  cell.appendChild(button);
  return cell;
}

export function flashCellClass(cell, className) {
  cell.classList.remove(className);
  void cell.offsetWidth;
  cell.classList.add(className);

  setTimeout(() => {
    cell.classList.remove(className);
  }, 1000);
}
