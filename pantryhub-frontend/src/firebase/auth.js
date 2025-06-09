import { auth } from "./firebase";
import jwtDecode from 'jwt-decode';

export async function storeFirebaseToken() {
    if (!auth.currentUser) 
        return ;
    const idToken = await auth.currentUser.getIdToken(true);
    localStorage.setItem("firebaseToken", idToken);
}

const token = localStorage.getItem('token');
let userRole = null;

if (token) {
  const decoded = jwtDecode(token);
  userRole = decoded.role;
}

export const getUserRole = () => userRole;

