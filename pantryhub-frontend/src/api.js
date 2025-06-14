import { getAuth } from "firebase/auth";

const API_BASE_URL = "http://localhost:5000";

async function getAuthToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  return await user.getIdToken(true);
}

async function makeAuthenticatedRequest(endpoint, method = 'GET', body = null) {
    try {
        const idToken = await getAuthToken(); //get firebase id token

        const headers = {
            "Authorization" : `Bearer ${idToken}`, 
        };

        const config = {
            method,
            headers,
        };

        if (body) {
            if (body instanceof FormData) {
                config.body = body;      
            } else {
                headers["Content-Type"] = "application/json";
                config.body = JSON.stringify(body);
            }

        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`Error! Status : ${response.status}`)

        }

        return await response.json();
        } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const api = {
  // Inventory endpoints
  // You must provide the owner_id when fetching all items for a user
  getUserItems: (ownerId) => makeAuthenticatedRequest(`/items/${ownerId}`),
  fetchItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`),
  createItem: (itemData) => makeAuthenticatedRequest('/items', 'POST', itemData),
  updateItem: (itemId, updates) => makeAuthenticatedRequest(`/items/${itemId}`, 'PUT', updates),
  deleteItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`, 'DELETE'),

  // Admin: fetch all items
  //getAllItemsAdmin: () => makeAuthenticatedRequest('/items/admin'),

  // Marketplace endpoints
  getMarketplaceItems: () => makeAuthenticatedRequest('/marketplace'),
  createMarketplaceItem: (itemData) => makeAuthenticatedRequest('/marketplace', 'POST', itemData),
  updateMarketplaceItem: (itemId, updates) => makeAuthenticatedRequest(`/marketplace/${itemId}`, 'PATCH', updates),
};

// 