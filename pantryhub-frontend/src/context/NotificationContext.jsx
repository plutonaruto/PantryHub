import { createContext, useContext, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const token = await currentUser.getIdToken();
    const res = await axios.get(
      `${API_BASE_URL}/notifications/${currentUser.uid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setNotifications(res.data);
    setLoading(false);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, fetchNotifications, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
