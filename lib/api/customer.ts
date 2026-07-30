const API_BASE_URL = "https://gear-up-backend-pi.vercel.app/api";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchMyRentals() {
  const res = await fetch(`${API_BASE_URL}/customer/rentals`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch rentals");
  }
  return res.json();
}

export async function fetchMyPayments() {
  const res = await fetch(`${API_BASE_URL}/payment`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch payments");
  }
  return res.json();
}

export async function createCheckout(rentalOrderId: string) {
  const res = await fetch(`${API_BASE_URL}/payment/checkout`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rentalOrderId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create checkout");
  }
  return res.json();
}

export async function submitReview(data: { gearItemId: string; rating: number; comment: string }) {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit review");
  }
  return res.json();
}

export async function createRentalOrder(data: { startDate: string; endDate: string; gearItemIds: string[] }) {
  const res = await fetch(`${API_BASE_URL}/customer/rentals`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create rental order");
  }
  return res.json();
}
