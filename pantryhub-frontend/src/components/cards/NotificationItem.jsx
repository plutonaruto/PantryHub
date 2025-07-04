import axios from "axios";

export default function NotificationItem({ notification, onMarkRead }) {
  const markAsRead = async () => {
    await axios.patch(`/notifications/${notification.id}/mark-read`);
    onMarkRead(notification.id);
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
