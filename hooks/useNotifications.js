import { useAppContext } from '../contexts/CommonContext';
import { useRouter } from 'next/router';

export function useNotifications() {
    const { 
        notifications, 
        markNotificationAsRead, 
        deleteNotification,
        showNotifications,
        toggleNotifications
    } = useAppContext();
    const router = useRouter();

    // Get unread notifications count
    const unreadCount = notifications.filter(notif => notif.status === 0).length;

    // Sort notifications by date (newest first) and then by read status (unread first)
    const sortedNotifications = [...notifications].sort((a, b) => {
        // First sort by status (unread first)
        if (a.status !== b.status) {
            return a.status - b.status;
        }
        // Then sort by date (newest first)
        return new Date(b.data) - new Date(a.data);
    });

    async function handleNotificationClick(notification) {
        if (notification.status === 0) {
            await markNotificationAsRead(notification.id);
        }
    };

    async function handleDeleteNotification(notificationId) {
        await deleteNotification(notificationId);
    };

    function toggleNotificationPanel() {
        toggleNotifications();
    };

    // Get notification image source based on unread count
    function getNotificationImageSrc(themeIsLight) {
        const basePath = unreadCount > 0 ? 'notifications_active' : 'notifications';
        
        return `/images/${basePath}${themeIsLight ? '' : '_Pro'}.svg`;
    };

    return {
        notifications: sortedNotifications,
        unreadCount,
        showNotifications,
        handleNotificationClick,
        handleDeleteNotification,
        toggleNotificationPanel,
        getNotificationImageSrc
    };
}