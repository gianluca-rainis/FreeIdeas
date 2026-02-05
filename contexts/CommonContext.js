import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '../utils/apiConfig';
import { handleError } from '../utils/errorHandling';
import { useThemeImages } from '../hooks/useThemeImages';

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
            await fetch(getApiUrl('logout'), { credentials: "include" });
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
            const response = await fetch(getApiUrl('getRandomIdeaId'), {
                method: 'POST',
                credentials: "include"
            });

            const data = await response.json();

            if (data && data.success) {
                setRandomIdeaId(data.data.id);
            }
            else {
                throw new Error(data?data.error:"Error in getRandomIdeaId");
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
        const handler = () => loadRandomIdea();

        router.events.on('routeChangeComplete', handler);

        return () => {
            router.events.off('routeChangeComplete', handler);
        };
    }, [router, loadRandomIdea]);

    // User management
    useEffect(() => {
        ldAccountData();
    }, []);

    async function ldAccountData() {
        setIsLoading(true);
        
        const SQLdata = await getSessionDataAccountFromDatabase();
        
        if (SQLdata) {
            loadData(SQLdata, false);
        }
        else {
            const adminSQLdata = await getSessionDataAdminFromDatabase();
            
            if (adminSQLdata) {
                loadData(adminSQLdata, true);
            }
            else {
                setUser(null);
                setNotifications([]);
            }
        }
        
        setIsLoading(false);
    }

    async function getSessionDataAccountFromDatabase() {
        try {
            const res = await fetch(`${getApiUrl('getSessionData')}?data=account`, {
                credentials: "include"
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getSessionDataAdminFromDatabase() {
        try {
            const res = await fetch(`${getApiUrl('getSessionData')}?data=administrator`, {
                credentials: "include"
            });

            const data = await res.json();

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    function loadData(SQLdata, admin=false) {
        try {
            // Set React state
            setUser({ 
                ...SQLdata, 
                isAdmin: admin,
                userimage: SQLdata.userimage,
                username: SQLdata.username,
                name: SQLdata.name,
                surname: SQLdata.surname
            });
            
            if (!admin) {
                // Fix the notification date
                SQLdata.notifications.forEach(notification => {
                    notification.data = notification.data.split('T')[0];
                });

                setNotifications(SQLdata.notifications || []);
                // Load notifications into the UI
                setTimeout(() => loadNotifications(SQLdata), 100);
            }
            else {
                setNotifications([]);
            }

            // Update DOM directly
            if (typeof window !== 'undefined') {
                updateUserUI(SQLdata, admin);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
            setNotifications([]);
        }
    }

    function updateUserUI(SQLdata, admin=false) {
        try {
            const userImageDisplayed = !admin 
                ? (SQLdata.userimage != null ? SQLdata.userimage : `/images/user${themeIsLight ? "" : "_Pro"}.svg`)
                : `/images/FreeIdeas_ReservedArea.svg`;

            // Update user image in navigation
            const loginButton = document.getElementById("userImage");

            if (loginButton) {
                loginButton.src = userImageDisplayed;
            }

            // Update username display
            const userNameElement = document.getElementById("userName");

            if (userNameElement) {
                userNameElement.innerHTML = SQLdata.username;
            }

            // Update PC login block
            const pcLoginSignUpBlock = document.getElementById("pcLoginSignUpBlock");

            if (pcLoginSignUpBlock) {
                pcLoginSignUpBlock.innerHTML = `<h2>Welcome ${SQLdata.username}</h2>
                    <img src="${userImageDisplayed}" alt="User Image" style="width: 60px; height: 60px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
                    <h3 style="margin-bottom: 20px">${SQLdata.name ? SQLdata.name : ""} ${SQLdata.surname ? SQLdata.surname : ""}</h3>
                    <button type="submit" id="sendAccountButton">Account</button>
                    <button type="submit" id="sendLogoutButton">Log Out</button>`;
            }

            // Update mobile login block
            const mobileLoginSignUpBlock = document.getElementById("mobileLoginSignUpBlock");

            if (mobileLoginSignUpBlock) {
                mobileLoginSignUpBlock.innerHTML = `<h2>Welcome ${SQLdata.username}</h2>
                    <div style="align-items: center;">
                        <img src="${userImageDisplayed}" alt="User Image" style="width: 100px; height: 100px; text-align: 'center'; margin-bottom: 40px; margin-top: 30px;">
                    </div>
                    <h3 style="margin-bottom: 20px">${SQLdata.name ? SQLdata.name : ""} ${SQLdata.surname ? SQLdata.surname : ""}</h3>
                    <div style="align-items: center;">
                        <button type="submit" id="sendAccountButtonMobile">Account</button>
                        <button type="submit" id="sendLogoutButtonMobile">Log Out</button>
                    </div>`;
            }

            // Add event listeners for buttons
            setTimeout(() => {
                const sendAccountButton = document.getElementById("sendAccountButton");

                if (sendAccountButton) {
                    sendAccountButton.addEventListener("click", () => {
                        if (typeof window !== "undefined") {
                            if (!admin) {
                                window.location.href = "/account";
                            }
                            else {
                                window.location.href = "/reservedArea";
                            }
                        }
                    });
                }

                const sendAccountButtonMobile = document.getElementById("sendAccountButtonMobile");

                if (sendAccountButtonMobile) {
                    sendAccountButtonMobile.addEventListener("click", () => {
                        if (typeof window !== "undefined") {
                            if (!admin) {
                                window.location.href = "/account";
                            }
                            else {
                                window.location.href = "/reservedArea";
                            }
                        }
                    });
                }

                const sendLogoutButton = document.getElementById("sendLogoutButton");

                if (sendLogoutButton) {
                    sendLogoutButton.addEventListener("click", async () => {
                        await handleLogout();
                    });
                }

                const sendLogoutButtonMobile = document.getElementById("sendLogoutButtonMobile");

                if (sendLogoutButtonMobile) {
                    sendLogoutButtonMobile.addEventListener("click", async () => {
                        await handleLogout();
                    });
                }
            }, 100);
        } catch (error) {
            console.error(error);
        }
    }

    // useEffect to handle UI updates when login/notification states change
    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        try {
            const loginArea = document.getElementById("loginArea");
            const mobileMenuHidden = document.getElementById("mobileMenuHidden");
            const pcLoginSignUpBlock = document.getElementById("pcLoginSignUpBlock");
            const mobileLoginSignUpBlock = document.getElementById("mobileLoginSignUpBlock");
            const notificaionsMobile = document.getElementById("notificaionsMobile");
            const notificaions = document.getElementById("notificaions");

            // Handle login area visibility
            if (showLoginArea) {
                if (pcLoginSignUpBlock) {
                    pcLoginSignUpBlock.style.display = "block";
                }
                
                if (mobileLoginSignUpBlock) {
                    mobileLoginSignUpBlock.style.display = "block";
                }
                
                if (loginArea) {
                    loginArea.style.display = "block";
                }

                if (mobileMenuHidden) {
                    mobileMenuHidden.style.display = "flex";
                }
            }
            else {
                if (pcLoginSignUpBlock) {
                    pcLoginSignUpBlock.style.display = "none";
                }

                if (mobileLoginSignUpBlock) {
                    mobileLoginSignUpBlock.style.display = "none";
                }
            }
            
            // Handle notifications visibility
            if (showNotifications) {
                if (notificaionsMobile) {
                    notificaionsMobile.style.display = "block";
                }

                if (notificaions) {
                    notificaions.style.display = "block";
                }

                if (loginArea) {
                    loginArea.style.display = "block";
                }

                if (mobileMenuHidden) {
                    mobileMenuHidden.style.display = "flex";
                }
            }
            else {
                if (notificaionsMobile) {
                    notificaionsMobile.style.display = "none";
                }

                if (notificaions) {
                    notificaions.style.display = "none";
                }
            }

            // Hide everything if both are false
            if (!showLoginArea && !showNotifications) {
                if (loginArea) {
                    loginArea.style.display = "none";
                }

                if (mobileMenuHidden) {
                    mobileMenuHidden.style.display = "none";
                }
            }
        } catch (error) {
            console.error('Error in login/notification UI update:', error);
        }
    }, [showLoginArea, showNotifications]);

    // Load notifications when they change
    useEffect(() => {
        if (user && !user.isAdmin && notifications.length > 0) {
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
                
                notificationsShowOrder.forEach(notification => {
                    const li = document.createElement("li");
                    let dataETitle = document.createElement("div");
                    let content = document.createElement("div");

                    dataETitle.innerHTML = `<strong>${notification.title}</strong> &nbsp; - &nbsp; <div style="color: grey;">${notification.data}</div>`;
                    dataETitle.style.display = "flex";
                    content.innerHTML = `${notification.description.substring(0, 30)}...`;
                    content.dataset.fullDescription = notification.description;

                    li.appendChild(dataETitle);
                    li.appendChild(content);

                    if (notification.status == 0) {
                        li.classList = "unReadNotification";
                    }

                    li.dataset.notificationId = notification.id;

                    ul.appendChild(li);
                });

                // Add event listeners for notification buttons
                ul.querySelectorAll("li").forEach(li => li.addEventListener("click", () => {
                    ul.style.display = "none";
                    document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "block");

                    document.querySelectorAll(".hiddenNotificationData").forEach(element => element.innerHTML = `
                        <h3 style="display: flex; justify-content: center;">${li.querySelectorAll("div")[0].querySelector("strong").innerText} &nbsp; - &nbsp; <div style="color: grey;">${li.querySelectorAll("div")[0].querySelector("div").innerText}</div></h3>
                        <br>
                        <p>${li.querySelectorAll("div")[2].dataset.fullDescription}</p>
                        <div style="display: flex; justify-content: center; align-items: center;">
                            <img id="notificationBackImage" src="/images/back${themeIsLight?"":"_Pro"}.svg">
                            <input type="button" id="notificationDeleteButton" value="Delete">
                        </div>
                    `);

                    /* Back button */
                    document.getElementById("notificationBackImage").addEventListener("click", async () => {
                        ul.style.display = "block";
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

                            const response = await fetch(getApiUrl('setNotificationAsRead'), {
                                credentials: "include",
                                method: "POST",
                                body: formData
                            });

                            const data = await response.json();

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
                    });

                    /* Delete button */
                    document.getElementById("notificationDeleteButton").addEventListener("click", async () => {
                        ul.style.display = "block";
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "none");
                        
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.innerHTML = "");

                        const idToDelete = li.dataset.notificationId;

                        li.remove();

                        if (document.querySelectorAll("unReadNotification").length == 0) {
                            notificationPc.forEach(element => element.src = `/images/notifications${themeIsLight?"":"_Pro"}.svg`);
                        }

                        if (notificationsShowOrder.length < 6) {
                            for (let index = 0; index < (6 - notificationsShowOrder.length); index++) {
                                let linew = document.createElement("li");
                                let dataETitle = document.createElement("div");
                                let content = document.createElement("div");

                                dataETitle.innerHTML = `<strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div>`;
                                dataETitle.style.display = "flex";
                                content.innerHTML = ` `;

                                linew.appendChild(dataETitle);
                                linew.appendChild(content);

                                ul.appendChild(linew);
                            }
                        }

                        try {
                            const formData = new FormData();
                            formData.append("id", idToDelete);

                            const response = await fetch(getApiUrl('deleteNotification'), {
                                credentials: "include",
                                method: "POST",
                                body: formData
                            });

                            const data = await response.json();

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
                    });
                }));

                // Padding for the notifications
                if (notificationsShowOrder.length < 6) {
                    for (let index = 0; index < (6 - notificationsShowOrder.length); index++) {
                        let li = document.createElement("li");
                        let dataETitle = document.createElement("div");
                        let content = document.createElement("div");

                        dataETitle.innerHTML = `<strong> </strong> &nbsp; &nbsp; <div style="color: grey;"> </div>`;
                        dataETitle.style.display = "flex";
                        content.innerHTML = ` `;

                        li.appendChild(dataETitle);
                        li.appendChild(content);

                        ul.appendChild(li);
                    }
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