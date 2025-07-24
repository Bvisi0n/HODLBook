const API_URL = '/api/portfolio';

export async function getPortfolio() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function addToken(token) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token)
  });

  if (!res.ok) {
    const error = new Error('Failed to add token');
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;

  return res.json();
}

export async function deleteToken(tokenName) {
  const res = await fetch(`${API_URL}/${encodeURIComponent(tokenName)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete token');
}
