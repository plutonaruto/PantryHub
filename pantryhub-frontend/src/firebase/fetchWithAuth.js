export async function fetchWithAuth(url, opts = {}) {
  const token = localStorage.getItem("firebaseToken");

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: "include",  
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}
