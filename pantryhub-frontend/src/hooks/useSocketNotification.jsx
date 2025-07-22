import { useEffect } from "react";
import { io } from "socket.io-client";
import { useNotifications } from "../context/NotificationContext";
import { toast } from "react-hot-toast";

const socket = io("http://localhost:3000")

function useSocketNotification() {
    const { fetchNotifications } = useNotifications();

    useEffect(() => { 
        socket.on("notification", (data) => {
            console.log("Notification received:", data);
            toast(data.message)
            fetchNotifications(); // Fetch notifications when a new one is received

        });
        return () => 
            socket.off("notification"); // Clean up the listener on unmount
        }, []);
}

export default useSocketNotification;