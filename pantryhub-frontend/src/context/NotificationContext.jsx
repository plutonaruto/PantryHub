import { createContext, useContext, useState } from "react";
import { auth } from "../firebase/firebase";
import { useEffect } from 'react';
import { api } from '../api';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("User not logged in.");
        setNotifications([]);
        setLoading(false);
        return;
      }
      const data = await api.getNotifications(currentUser.uid);
      setNotifications(data);
      setError("");
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, fetchNotifications, loading, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
