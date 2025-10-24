const API_BASE = 'http://localhost:8000';

export async function getDestinations() {
  const res = await fetch(`${API_BASE}/destinations`);
  return res.json();
}
