import { auth } from "./firebase";

export async function storeFirebaseToken() {
    if (!auth.currentUser) 
        return ;
    const idToken = await auth.currentUser.getIdToken(true);
    localStorage.setItem("firebaseToken", idToken);
}

