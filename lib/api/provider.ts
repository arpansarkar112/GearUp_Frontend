const API_BASE_URL = "https://gear-up-backend-pi.vercel.app/api";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};



export async function fetchProviderGear() {
  const res = await fetch(`${API_BASE_URL}/provider/gear`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch provider gear");
  }
  return res.json();
}

export async function createProviderGear(data: any) {
  const res = await fetch(`${API_BASE_URL}/provider/gear`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create gear listing");
  }
  return res.json();
}

export async function updateProviderGear(gearId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/provider/gear/${gearId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update gear listing");
  }
  return res.json();
}

export async function deleteProviderGear(gearId: string) {
  const res = await fetch(`${API_BASE_URL}/provider/gear/${gearId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete gear listing");
  }
  return res.json();
}

export async function fetchProviderOrders() {
  const res = await fetch(`${API_BASE_URL}/provider/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch incoming orders");
  }
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/provider/orders/${orderId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update order status");
  }
  return res.json();
}

export async function fetchProviderReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews/provider`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch provider reviews");
  }
  return res.json();
}
