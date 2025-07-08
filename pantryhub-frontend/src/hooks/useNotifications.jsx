import { createContext, useContext, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { NotificationContext } from "../context/NotificationProvider";

export function NotificationsProvider({ children }) {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

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
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, setNotifications, fetchNotifications, loading }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
