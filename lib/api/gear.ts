const API_BASE_URL = "https://gear-up-backend-pi.vercel.app/api";

export async function fetchAllGear() {
  // We request a high limit so that our frontend sorting and filtering
  // has access to the complete inventory.
  const res = await fetch(`${API_BASE_URL}/gear?limit=1000`, {
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

export async function fetchAllCategories() {
  const res = await fetch(`${API_BASE_URL}/gear/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch categories");
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

export async function fetchAllReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch all reviews");
  }
  return res.json();
}

export async function fetchReviewsByGearId(id: string) {
  const res = await fetch(`${API_BASE_URL}/reviews/gear/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch gear reviews");
  }
  return res.json();
}
