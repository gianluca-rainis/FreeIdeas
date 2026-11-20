import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { apiCall } from '@/utils/apiConfig';
import { handleError } from '@/utils/errorHandling';
import { useThemeImages } from '@/hooks/useThemeImages';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Save global variables and set the functions to update their values
    const [bannerMessage, setBannerMessage] = useState("");
    const [showBanner, setBannerVisibility] = useState(false);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [randomIdeaId, setRandomIdeaId] = useState(null);
    const [showLoginArea, setShowLoginArea] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const {
        themeIsLight,
        toggleTheme,
        getImagePath,
        getUserImageSrc
    } = useThemeImages();
    
    const router = useRouter();

    // Logout function (moved from useAuth to avoid circular dependency)
    async function handleLogout() {
        try {
            await apiCall('logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        }
        
        // Redirect
        if (typeof window !== 'undefined') {
            window.location.href = "/";
        }
    }

    /* BANNER */
    useEffect(() => {
        setBannerMessage("");
        setBannerVisibility(false);
    }, []);

    // Window size management
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        if (typeof window !== 'undefined') {
            handleResize();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Random idea management
    const loadRandomIdea = useCallback(async () => {
        try {
            const data = await apiCall('getRandomIdeaId', {
                method: 'POST'
            });

            if (data && data.success) {
                setRandomIdeaId(data.data.id);
            }
            else {
                setRandomIdeaId(0);
            }
        } catch (error) {
            handleError(error, 'loadRandomIdea');
            setRandomIdeaId(0);
        }
    }, []);

    // First random idea load
    useEffect(() => {
        loadRandomIdea();
    }, [loadRandomIdea]);

    // Set new random idea when navigated
    useEffect(() => {
        router.events.on('routeChangeComplete', loadRandomIdea);

        return () => {
            router.events.off('routeChangeComplete', loadRandomIdea);
        };
    }, [router, loadRandomIdea]);

    const ldAccountData = useCallback(async () => {
        try {
            const accountData = await apiCall('/api/getSessionData?data=account');

            if (accountData) {
                setUser({ ...accountData, isAdmin: false });
                setNotifications(accountData.notifications || []);
                return;
            }

            const administratorData = await apiCall('/api/getSessionData?data=administrator');

            if (administratorData) {
                setUser({ ...administratorData, isAdmin: true });
                setNotifications([]);
                return;
            }

            setUser(null);
            setNotifications([]);
        } catch (error) {
            handleError(error, 'loadAccountData');
            setUser(null);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // User management
    useEffect(() => {
        ldAccountData();
    }, [ldAccountData]);

    // Reload account data when navigating between pages
    const reloadAccountData = useCallback(() => {
        ldAccountData();
    }, [ldAccountData]);
    
    useEffect(() => {
        router.events.on('routeChangeComplete', reloadAccountData);

        return () => {
            router.events.off('routeChangeComplete', reloadAccountData);
        };
    }, [router, reloadAccountData]);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        const notificationsMobile = document.getElementById("notificaionsMobile");
        const notificationsDesktop = document.getElementById("notificaions");

        if (notificationsMobile) {
            notificationsMobile.style.display = showNotifications ? "block" : "none";
        }

        if (notificationsDesktop) {
            notificationsDesktop.style.display = showNotifications ? "block" : "none";
        }

    }, [showNotifications]);

    function loadNotifications(SQLdata) {
        try {
                const notificationsShowOrder = [...(SQLdata.notifications || [])]
                    .sort((first, second) => new Date(second.data) - new Date(first.data))
                    .sort((first, second) => first.status - second.status);
                const hasUnread = notificationsShowOrder.some(notification => notification.status === 0);

                document.querySelectorAll("#notificationImageLi, #notificationImageLiMobile").forEach(button => {
                    button.classList.toggle('hasUnread', hasUnread);
                });

                document.querySelectorAll(".notificationsUl").forEach(list => {
                    list.replaceChildren();
                    const panel = list.closest("#notificaions, #notificaionsMobile");
                    const detail = panel?.querySelector(".hiddenNotificationData");

                    if (!panel || !detail) {
                        return;
                    }

                    function showEmptyState() {
                        const empty = document.createElement("li");
                        const content = document.createElement("div");
                        const title = document.createElement("strong");
                        const description = document.createElement("span");

                        empty.className = "notificationEmpty";
                        title.textContent = "You're all caught up";
                        description.textContent = "No new notifications";
                        content.append(title, description);
                        empty.appendChild(content);
                        list.replaceChildren(empty);
                    }

                    function showNotificationList() {
                        list.hidden = false;
                        detail.hidden = true;
                        detail.replaceChildren();
                    }

                    async function markAsRead(notificationId) {
                        const formData = new FormData();
                        formData.append("id", notificationId);

                        try {
                            const response = await apiCall('setNotificationAsRead', {
                                method: "POST",
                                body: formData
                            });

                            if (!response?.success) {
                                throw new Error(response?.error || "Unable to mark notification as read");
                            }

                            ldAccountData();
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    async function deleteNotification(notificationId) {
                        const formData = new FormData();
                        formData.append("id", notificationId);

                        try {
                            const response = await apiCall('deleteNotification', {
                                method: "POST",
                                body: formData
                            });

                            if (!response?.success) {
                                throw new Error(response?.error || "Unable to delete notification");
                            }

                            ldAccountData();
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    function showNotificationDetail(notification, item) {
                        list.hidden = true;
                        detail.hidden = false;
                        detail.replaceChildren();

                        const article = document.createElement("article");
                        const meta = document.createElement("div");
                        const date = document.createElement("p");
                        const title = document.createElement("h3");
                        const description = document.createElement("p");
                        const actions = document.createElement("div");
                        const backButton = document.createElement("button");
                        const deleteButton = document.createElement("button");

                        article.className = "notificationDetail";
                        meta.className = "notificationDetailMeta";
                        date.textContent = notification.data || "";
                        title.textContent = notification.title || "Notification";
                        description.className = "notificationDetailDescription";
                        description.textContent = notification.description || "";
                        actions.className = "notificationDetailActions";
                        backButton.type = "button";
                        backButton.className = "notificationBackImage";
                        backButton.setAttribute("aria-label", "Back");
                        backButton.textContent = "Back";
                        deleteButton.type = "button";
                        deleteButton.className = "notificationDeleteButton";
                        deleteButton.textContent = "Delete";

                        backButton.addEventListener("click", async () => {
                            showNotificationList();

                            if (notification.status === 0) {
                                item.classList.remove("unReadNotification");
                                await markAsRead(notification.id);
                            }
                        });

                        deleteButton.addEventListener("click", async () => {
                            showNotificationList();
                            await deleteNotification(notification.id);
                        });

                        meta.append(date, title);
                        actions.append(backButton, deleteButton);
                        article.append(meta, description, actions);
                        detail.appendChild(article);
                    }

                    if (notificationsShowOrder.length === 0) {
                        showEmptyState();
                        return;
                    }

                    notificationsShowOrder.forEach(notification => {
                        const item = document.createElement("li");
                        const status = document.createElement("span");
                        const copy = document.createElement("div");
                        const title = document.createElement("strong");
                        const description = document.createElement("p");
                        const date = document.createElement("time");
                        const fullDescription = notification.description || "";

                        item.className = notification.status === 0 ? "notificationItem unReadNotification" : "notificationItem";
                        status.className = "notificationStatusDot";
                        copy.className = "notificationCopy";
                        title.textContent = notification.title || "Notification";
                        description.textContent = fullDescription.length > 72 ? `${fullDescription.substring(0, 72)}...` : fullDescription;
                        date.textContent = notification.data || "";
                        item.append(status, copy, date);
                        copy.append(title, description);
                        item.addEventListener("click", () => showNotificationDetail(notification, item));
                        list.appendChild(item);
                    });
                });
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Load notifications when they change
    useEffect(() => {
        if (user && !user.isAdmin) {
            setTimeout(() => loadNotifications({ notifications }), 100);
        }
    }, [notifications, user, themeIsLight]);

    // Load notifications for users (not admins)
    function loadNotifications(SQLdata) {
        try {
            const notificationPc = document.querySelectorAll(".notificationsImg");
            let numNewNotifications = 0;
            let notificationsShowOrder = [];

            // Order by date
            function orderByData(array) {
                return array.sort((a, b) => {
                    let dateA = new Date(a['data']);
                    let dateB = new Date(b['data']);
                    return dateB - dateA;
                });
            }

            // Order by unread first
            function orderByNotReaded(array) {
                return array.sort((a, b) => a.status - b.status);
            }

            notificationsShowOrder = orderByData(SQLdata.notifications || []);
            notificationsShowOrder = orderByNotReaded(notificationsShowOrder);

            // Count new notifications
            notificationsShowOrder.forEach(notification => {
                if (notification.status === 0) {
                    numNewNotifications++;
                }
            });

            // Update notification icons if there are new notifications
            if (numNewNotifications > 0) {
                notificationPc.forEach(element => {
                    element.src = `/images/notifications_active${themeIsLight ? "" : "_Pro"}.svg`;
                });
            }

            // Load notification data into UI
            const notificationsUl = document.querySelectorAll(".notificationsUl");

            notificationsUl.forEach(ul => {
                ul.innerHTML = ""; // Clear existing notifications
                
                if (notificationsShowOrder.length === 0) {
                    const empty = document.createElement("li");
                    empty.className = "notificationEmpty";
                    empty.innerHTML = `<div><strong>You're all caught up</strong><span>No new notifications</span></div>`;
                    ul.appendChild(empty);
                }

                notificationsShowOrder.forEach(notification => {
                    const li = document.createElement("li");
                    li.className = notification.status == 0 ? "notificationItem unReadNotification" : "notificationItem";
                    li.dataset.notificationId = notification.id;

                    li.innerHTML = `
                        <span class="notificationStatusDot"></span>
                        <div class="notificationCopy">
                            <strong>${notification.title}</strong>
                            <p>${notification.description.substring(0, 72)}${notification.description.length > 72 ? '...' : ''}</p>
                        </div>
                        <time>${notification.data}</time>
                    `;

                    li.dataset.fullDescription = notification.description;
                    ul.appendChild(li);
                });

                // Add event listeners for notification buttons
                ul.querySelectorAll("li").forEach(li => li.addEventListener("click", () => {
                    // Keep mobile/desktop notification state in sync when viewport changes
                    document.querySelectorAll(".notificationsUl").forEach(list => list.style.display = "none");
                    document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "block");

                    const title = li.querySelector("strong")?.textContent || "Notification";
                    const date = li.querySelector("time")?.textContent || "";
                    const description = li.dataset.fullDescription || "";

                    document.querySelectorAll(".hiddenNotificationData").forEach(element => element.innerHTML = `
                        <article class="notificationDetail">
                            <div class="notificationDetailMeta">
                                <p>${date}</p>
                                <h3>${title}</h3>
                            </div>
                            <p class="notificationDetailDescription">${description}</p>
                            <div class="notificationDetailActions">
                                <button type="button" class="notificationBackImage" aria-label="Back">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                                    <span>Back</span>
                                </button>
                                <button type="button" class="notificationDeleteButton">
                                    <span>Delete</span>
                                </button>
                            </div>
                        </article>
                    `);

                    /* Back button */
                    document.querySelectorAll(".notificationBackImage").forEach(backButton => backButton.addEventListener("click", async () => {
                        document.querySelectorAll(".notificationsUl").forEach(list => list.style.display = "block");
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "none");

                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.innerHTML = "");

                        const idToSetStatus = li.dataset.notificationId;

                        li.classList = ``;

                        if (document.querySelectorAll("unReadNotification").length == 0) {
                            notificationPc.forEach(element => element.src = `/images/notifications${themeIsLight?"":"_Pro"}.svg`);
                        }

                        try {
                            const formData = new FormData();
                            formData.append("id", idToSetStatus);

                            const data = await apiCall('setNotificationAsRead', {
                                method: "POST",
                                body: formData
                            });

                            if (data) {
                                if (!data['success']) {
                                    console.error(data['error']);
                                }
                            }
                            else {
                                console.error(`ERROR 421: UNABLE TO SET NOTIFICATION ${idToSetStatus} AS READ.`);
                            }
                        } catch (error) {
                            console.error(error);
                        }

                        // Reload user data to get updated notifications
                        ldAccountData();
                    }));

                    /* Delete button */
                    document.querySelectorAll(".notificationDeleteButton").forEach(deleteButton => deleteButton.addEventListener("click", async () => {
                        document.querySelectorAll(".notificationsUl").forEach(list => list.style.display = "block");
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "none");
                        
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.innerHTML = "");

                        const idToDelete = li.dataset.notificationId;

                        li.remove();

                        if (document.querySelectorAll("unReadNotification").length == 0) {
                            notificationPc.forEach(element => element.src = `/images/notifications${themeIsLight?"":"_Pro"}.svg`);
                        }

                        if (ul.querySelectorAll("li").length === 0) {
                            const empty = document.createElement("li");
                            empty.className = "notificationEmpty";
                            empty.innerHTML = `<div><strong>You're all caught up</strong><span>No new notifications</span></div>`;
                            ul.appendChild(empty);
                        }

                        try {
                            const formData = new FormData();
                            formData.append("id", idToDelete);

                            const data = await apiCall('deleteNotification', {
                                method: "POST",
                                body: formData
                            });

                            if (data) {
                                if (!data['success']) {
                                    console.error(data['error']);
                                }
                            }
                            else {
                                console.error(`ERROR 421: UNABLE TO SET NOTIFICATION ${idToSetStatus} AS READ.`);
                            }
                        } catch (error) {
                            console.error(error);
                        }

                        // Reload user data to get updated notifications
                        ldAccountData();
                    }));
                }));

                if (notificationsShowOrder.length === 0) {
                    const empty = document.createElement("li");
                    empty.className = "notificationEmpty";
                    empty.innerHTML = `<div><strong>You're all caught up</strong><span>No new notifications</span></div>`;
                    ul.appendChild(empty);
                }
            });

        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    // Login/Navigation area management
    function toggleLoginArea() {
        setShowLoginArea(prev => {
            const newValue = !prev;

            if (newValue) {
                setShowNotifications(false);
            }

            return newValue;
        });
    }

    function toggleNotifications() {
        setShowNotifications(prev => {
            const newValue = !prev;

            if (newValue) {
                setShowLoginArea(false);
            }

            return newValue;
        });
    }

    // Modal state
    const [currentModal, setCurrentModal] = useState(null);

    // Custom modals
    const showAlert = useCallback((text) => {
        return new Promise((resolve) => {
            setCurrentModal({
                type: 'alert',
                text,
                onClose: () => {
                    setCurrentModal(null);
                    resolve(true);
                }
            });
        });
    }, []);

    const showConfirm = useCallback((text) => {
        return new Promise((resolve) => {
            setCurrentModal({
                type: 'confirm',
                text,
                onConfirm: () => {
                    setCurrentModal(null);
                    resolve(true);
                },
                onCancel: () => {
                    setCurrentModal(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const showPrompt = useCallback((message, defaultValue = "") => {
        return new Promise((resolve) => {
            setCurrentModal({
                type: 'prompt',
                message,
                defaultValue,
                onSubmit: (value) => {
                    setCurrentModal(null);
                    resolve(value);
                },
                onCancel: () => {
                    setCurrentModal(null);
                    resolve(null);
                }
            });
        });
    }, []);

    const showLoading = useCallback((text) => {
        setCurrentModal({
            type: 'loading',
            text,
            onClose: () => {
                setCurrentModal(null);
            }
        });

        // Return a close loading function
        return () => {
            setCurrentModal(null);
        };
    }, []);

    const closeModal = useCallback(() => {
        if (currentModal && currentModal.onCancel) {
            currentModal.onCancel();
        }
        else if (currentModal && currentModal.onClose) {
            currentModal.onClose();
        }
    }, [currentModal]);

    const value = {
        // Banner
        bannerMessage,
        showBanner,

        // Theme
        themeIsLight,
        toggleTheme,
        
        // User and authentication
        user,
        isLoading,
        refreshUserData: ldAccountData,
        handleLogout,
        
        // Notifications
        notifications,
        loadNotifications,
        
        // UI State
        showLoginArea,
        showNotifications,
        toggleLoginArea,
        toggleNotifications,
        windowSize,
        
        // Random idea
        randomIdeaId,
        loadRandomIdea,
        
        // Utilities
        getImagePath,
        getUserImageSrc,
        
        // Modals
        currentModal,
        showAlert,
        showConfirm,
        showPrompt,
        showLoading,
        closeModal
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    
    return context;
}
