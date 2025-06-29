// not linked to /inventory which is not a backend endpoint
import { getAuth } from "firebase/auth";

const API_BASE_URL = "http://localhost:3000";

async function getAuthToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    window.location.href = "/register";
    return null;
  }

  try {
    const idToken = await user.getIdToken();
    console.log("idToken:", idToken);
    return idToken;
  } catch (error) {
    console.error("Error in fetching ID token:", error);
    return null;
  }
}

async function makeAuthenticatedRequest(endpoint, method = 'GET', body = null) {
    try {
        const idToken = await getAuthToken(); //get firebase id token
        console.log("idToken:", idToken);
        if (!idToken) {
            console.error("ID Token is missing. Redirecting to login...");
            return;
        }

        const headers = {
            "Authorization" : `Bearer ${idToken}`, 
        };

        const config = {
            method,
            headers,
            credentials: 'include',
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
  getAllItems: () => makeAuthenticatedRequest('/items'),
  getUserItems: (ownerId) => makeAuthenticatedRequest(`/items/${ownerId}`),
  fetchItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`),
  createItem: (itemData) => makeAuthenticatedRequest('/items', 'POST', itemData),
  updateItem: (itemId, updates) => makeAuthenticatedRequest(`/items/${itemId}`, 'PATCH', updates),
  updateItemQuantity: (itemId, quantity) => makeAuthenticatedRequest(`/items/${itemId}`, 'PUT', { quantity }),
  deleteItem: (itemId) => makeAuthenticatedRequest(`/items/${itemId}`, 'DELETE'),

  // Marketplace endpoints
  getMarketplaceItems: () => makeAuthenticatedRequest('/marketplace'),
  createMarketplaceItem: (itemData) => makeAuthenticatedRequest('/marketplace', 'POST', itemData),
  updateMarketplaceItem: (itemId, updates) => makeAuthenticatedRequest(`/marketplace/${itemId}`, 'PATCH', updates),

  // Equipment endpoints
  createEquipment: (equipmentData) => makeAuthenticatedRequest('/equipment', 'POST', equipmentData),
  getAllEquipment: () => makeAuthenticatedRequest('/equipment'),
};