import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Get the current Firebase ID token.
 */
async function getAuthToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.warn("User not authenticated.");
    return null;
  }

  try {
    const idToken = await user.getIdToken();
    console.log("Firebase ID Token:", idToken);
    return idToken;
  } catch (error) {
    console.error("Error fetching Firebase ID token:", error);
    return null;
  }
}

async function makeAuthenticatedRequest(endpoint, method = "GET", body = null) {
  const idToken = await getAuthToken();

  if (!idToken) {
    console.warn("No token found");
    return { error: "User not logged in", status: 401 };
  }

  const headers = {
    "Authorization": `Bearer ${idToken}`,
    "Accept": "application/json",
  };

  const config = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      const errorText = contentType && contentType.includes("application/json")
        ? await response.json()
        : await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText} - ${JSON.stringify(errorText)}`);
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const api = {
  // Inventory endpoints
  getAllItems: () => makeAuthenticatedRequest("/items"),
  getUserItems: (ownerId) => makeAuthenticatedRequest(`/items/owner/${ownerId}`),
  fetchItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`),
  createItem: (itemData) => makeAuthenticatedRequest("/items", "POST", itemData),
  updateItem: (itemId, updates) => makeAuthenticatedRequest(`/items/${itemId}`, "PATCH", updates),
  updateItemQuantity: (itemId, quantity) => makeAuthenticatedRequest(`/items/${itemId}`, "PUT", { quantity }),
  deleteItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`, "DELETE"),

  // Marketplace endpoints
  getMarketplaceItems: () => makeAuthenticatedRequest("/marketplace"),
  createMarketplaceItem: (itemData) => makeAuthenticatedRequest("/marketplace", "POST", itemData),
  updateMarketplaceItem: (itemId, updates) => makeAuthenticatedRequest(`/marketplace/${itemId}`, "PATCH", updates),
  fetchMarketplaceItem: (id) => makeAuthenticatedRequest(`/marketplace/${id}`),
  deleteMarketplaceItem: (itemId) => makeAuthenticatedRequest(`/marketplace/${itemId}`, "DELETE"),

  // Notification endpoints
  getNotifications: (userId) => makeAuthenticatedRequest(`/notifications/${userId}`),
  markNotificationRead: (notifId) => makeAuthenticatedRequest(`/notifications/${notifId}/mark-read`, "PATCH"),

  // Equipment endpoints
  createEquipment: (equipmentData) => makeAuthenticatedRequest("/equipment", "POST", equipmentData),
  getAllEquipment: () => makeAuthenticatedRequest("/equipment"),
  getEquipment: (equipmentId) => makeAuthenticatedRequest(`/equipment/${equipmentId}`),
  getEquipmentLogs: () => makeAuthenticatedRequest("/equipment/log"),
  checkIn: (equipmentId) => makeAuthenticatedRequest(`/equipment/${equipmentId}/checkin`, "PATCH"),
  checkOut: (equipmentId) => makeAuthenticatedRequest(`/equipment/${equipmentId}/checkout`, "PATCH"),
};
