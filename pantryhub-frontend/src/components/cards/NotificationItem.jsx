import { api } from "../../api";

export default function NotificationItem({ notification, onMarkRead }) {
  const markAsRead = async () => {
    try {
      await api.markNotificationRead(notification.id);
      onMarkRead(notification.id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div
      className={`border p-3 rounded flex justify-between items-center ${
        notification.read ? "bg-gray-100" : "bg-yellow-50"
      }`}
    >
      <div>
        <p className="font-medium">{notification.message}</p>
        <p className="text-xs text-gray-500">
          {new Date(notification.timestamp).toLocaleString()}
        </p>
      </div>
      {!notification.read && (
        <button
          onClick={markAsRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark as Read
        </button>
      )}
    </div>
  );
}
