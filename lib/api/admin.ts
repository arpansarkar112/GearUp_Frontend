const API_BASE_URL = "https://gear-up-backend-pi.vercel.app/api";

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchAllUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch all users");
  }
  return res.json();
}

export async function updateUserStatus(userId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update user status");
  }
  return res.json();
}

export async function fetchAllAdminGear() {
  const res = await fetch(`${API_BASE_URL}/admin/gear`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch gear");
  }
  return res.json();
}

export async function fetchAllOrders() {
  const res = await fetch(`${API_BASE_URL}/admin/rentals`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch orders");
  }
  return res.json();
}

export async function createCategory(data: { name: string; description: string; image?: string }) {
  const res = await fetch(`${API_BASE_URL}/gear/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create category");
  }
  return res.json();
}

export async function updateCategory(categoryId: string, data: { name?: string; description?: string; image?: string }) {
  const res = await fetch(`${API_BASE_URL}/gear/categories/${categoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update category");
  }
  return res.json();
}

export async function createAdminGear(data: any) {
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
