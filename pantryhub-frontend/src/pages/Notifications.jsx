import { useNotifications } from "../context/NotificationContext";
import NotificationItem from "../components/cards/NotificationItem";
import useSocketNotification from "../hooks/useSocketNotification";
import LayoutWrapper from "../components/layout/LayoutWrapper";

export default function Notifications() {
  useSocketNotification(); 
  const { notifications, setNotifications, loading, error } = useNotifications();

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <LayoutWrapper showTopbar={false}>
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
    </LayoutWrapper>
  );
}
