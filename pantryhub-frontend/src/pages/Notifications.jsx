import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { useAuth } from "../firebase/AuthProvider"
import NotificationItem from "../components/cards/NotificationItem";

export default function Notifications() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 useEffect(() => {
  const fetchNotifications = async () => {
    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
        setError("User not logged in.");
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

        if (Array.isArray(res.data)) {
        setNotifications(res.data);
        } else {
        setNotifications([]);
        console.error("Unexpected response:", res.data);
        }
    } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
    } finally {
        setLoading(false);
    }
  };

    fetchNotifications();
  }, [user]);

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={(id) =>
                setNotifications((prev) =>
                  prev.map((x) => (x.id === id ? { ...x, read: true } : x))
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
