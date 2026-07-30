const API_BASE_URL = "https://gear-up-backend-pi.vercel.app/api";

export async function fetchAllGear() {
  const res = await fetch(`${API_BASE_URL}/gear`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch gear");
  }
  return res.json();
}

export async function fetchGearById(id: string) {
  const res = await fetch(`${API_BASE_URL}/gear/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch gear details");
  }
  return res.json();
}
