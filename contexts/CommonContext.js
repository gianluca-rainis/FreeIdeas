import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '../utils/apiConfig';
import { handleError, getUserFriendlyErrorMessage, ValidationError } from '../utils/errorHandling';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Save global variables and set the functions to update their values
    const [bannerMessage, setBannerMessage] = useState("");
    const [showBanner, setBannerVisibility] = useState(false);
    const [themeIsLight, setThemeIsLight] = useState(true);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [randomIdeaId, setRandomIdeaId] = useState(null);
    const [showLoginArea, setShowLoginArea] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    
    const router = useRouter();

    // Logout function (moved from useAuth to avoid circular dependency)
    async function handleLogout() {
        try {
            await fetch(getApiUrl('logout'), { credentials: "include" });
        } catch (error) {
            console.error(error);
        }
        
        // Redirect
        window.location.href = "/";
    }

    /* BANNER */
    useEffect(() => {
        setBannerMessage("");
        setBannerVisibility(false);
    }, []);

    /* THEME GESTOR */
    // Update the theme
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const savedTheme = localStorage.getItem("themeIsLight");

        if (savedTheme !== null) {
            setThemeIsLight(savedTheme === "true");
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

        function handleChange(e) {
            const newTheme = e.matches;

            setThemeIsLight(newTheme);

            localStorage.setItem("themeIsLight", newTheme);
        }

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Update the theme in the document
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute("data-theme", themeIsLight?"light":"dark");
            
            // Update all theme-related elements whenever theme changes
            updateThemeElements(themeIsLight);
        }
    }, [themeIsLight]);

    // Toggle the theme
    function toggleTheme() {
        const newTheme = !themeIsLight;

        setThemeIsLight(newTheme);

        if (typeof window !== 'undefined') {
            localStorage.setItem("themeIsLight", newTheme);
            
            // Update all theme-related elements
            updateThemeElements(newTheme);
        }
    }
    
    // Function to update all theme-related elements
    function updateThemeElements(isLight) {
        if (typeof document === 'undefined') {
            return;
        }
        
        try {
            // Update toggle theme buttons
            const lightDarkThemeButtons = document.querySelectorAll(".toggle-light-dark-theme");
            lightDarkThemeButtons.forEach(button => {
                if (button) {
                    button.src = isLight ? "/images/sun-dark.svg" : "/images/sun-light.svg";
                }
            });

            // Update GitHub logo
            const githubLogo = document.getElementById("githubLogo");
            if (githubLogo) {
                githubLogo.src = isLight ? "./images/github.svg" : "./images/github-white.svg";
            }

            // Update FreeIdeas logos
            const logos = [
                document.getElementById("pcNavBarGhost")?.querySelector("#navLogo"),
                document.getElementById("mobileNavBarGhost")?.querySelector("#navLogo"),
                document.getElementById("footerLogo")
            ].filter(Boolean);

            // Add dynamic logos based on current page
            if (window.location.pathname.includes("/about")) {
                const aboutLogo = document.querySelector(".footerpage")?.querySelector(".logo");
                if (aboutLogo) {
                    logos.push(aboutLogo);
                }
            }

            if (window.location.pathname.includes("/contacts")) {
                const contactsLogo = document.querySelector(".footerpage")?.querySelector(".logo");
                if (contactsLogo) {
                    logos.push(contactsLogo);
                }
            }

            if (window.location.pathname.includes("/index") || window.location.pathname === "/") {
                const indexLogo = document.getElementById("indexMain")?.querySelector(".logo");
                if (indexLogo) {
                    logos.push(indexLogo);
                }
            }

            logos.forEach(logo => {
                if (logo) {
                    logo.src = `./images/FreeIdeas${isLight ? "" : "_Pro"}.svg`;
                }
            });

            // Update mobile menu icon
            const menuMobile = document.getElementById("mobileNavBarGhost")?.querySelector("#menuMobile");

            if (menuMobile) {
                menuMobile.src = `./images/menu${isLight ? "" : "_Pro"}.svg`;
            }

            // Update user image (if it's the default user icon)
            const userImage = document.getElementById("userImage");

            if (userImage && userImage.src.includes("/images/user")) {
                userImage.src = `./images/user${isLight ? "" : "_Pro"}.svg`;
            }

            // Update notification back image
            const notificationBackImage = document.getElementById("notificationBackImage");

            if (notificationBackImage) {
                notificationBackImage.src = `./images/back${isLight ? "" : "_Pro"}.svg`;
            }

            // Update notification icons
            const notificationImgs = document.querySelectorAll(".notificationsImg");

            notificationImgs.forEach(element => {
                if (element.src.includes("/images/notifications_active")) {
                    element.src = `./images/notifications_active${isLight ? "" : "_Pro"}.svg`;
                }
                else if (element.src.includes("/images/notifications")) {
                    element.src = `./images/notifications${isLight ? "" : "_Pro"}.svg`;
                }
            });

            // Update page-specific icons
            if (window.location.href.includes("/publishAnIdea")) {
                const addAdditionalInfo = document.getElementById("addAdditionalInfo");
                const addLog = document.getElementById("addLog");
                const cancelNewIdea = document.getElementById("cancelNewIdea");
                
                if (addAdditionalInfo) {
                    addAdditionalInfo.src = `./images/add${isLight ? "" : "_Pro"}.svg`;
                }

                if (addLog) {
                    addLog.src = `./images/add${isLight ? "" : "_Pro"}.svg`;
                }

                if (cancelNewIdea) {
                    cancelNewIdea.src = `./images/delete${isLight ? "" : "_Pro"}.svg`;
                }
            }

            if (window.location.href.includes("/accountVoid")) {
                const publishedAccount = document.getElementById("publishedAccount");
                const savedAccount = document.getElementById("savedAccount");
                
                if (publishedAccount?.children.item(0)) {
                    publishedAccount.children.item(0).src = `./images/publish${isLight ? "" : "_Pro"}.svg`;
                }

                if (savedAccount?.children.item(0)) {
                    savedAccount.children.item(0).src = `./images/saved${isLight ? "" : "_Pro"}.svg`;
                }
            }

            if (window.location.href.includes("/ideaVoid")) {
                const modifyOldIdea = document.getElementById("modifyOldIdea");
                if (modifyOldIdea) {
                    modifyOldIdea.src = `./images/modify${isLight ? "" : "_Pro"}.svg`;
                }
            }
        } catch (error) {
            console.error('Error updating theme elements:', error);
        }
    }

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
    useEffect(() => {
        loadRandomIdea();
    }, []);

    async function loadRandomIdea() {
        try {
            const response = await fetch(getApiUrl('getRandomIdeaId'), {
                credentials: "include"
            });

            const data = await response.json();

            setRandomIdeaId(data?data.id:null);
        } catch (error) {
            handleError(error, 'loadRandomIdea');
            setRandomIdeaId(null);
        }
    }

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

            return data && data.id ? data : null;
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

            return data && data.id ? data : null;
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
                setNotifications(SQLdata.notifications || []);
                // Load notifications into the UI
                setTimeout(() => loadNotifications(SQLdata), 100);
            }
            else {
                setNotifications([]);
            }

            // Update DOM directly
            updateUserUI(SQLdata, admin);
        } catch (error) {
            console.error(error);
            setUser(null);
            setNotifications([]);
        }
    }

    function updateUserUI(SQLdata, admin=false) {
        try {
            const userImageDisplayed = !admin 
                ? (SQLdata.userimage != null ? SQLdata.userimage : `./images/user${themeIsLight ? "" : "_Pro"}.svg`)
                : `./images/FreeIdeas_ReservedArea.svg`;

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
                        if (!admin) {
                            window.location.href = "/accountVoid";
                        }
                        else {
                            window.location.href = "/reservedArea";
                        }
                    });
                }

                const sendAccountButtonMobile = document.getElementById("sendAccountButtonMobile");

                if (sendAccountButtonMobile) {
                    sendAccountButtonMobile.addEventListener("click", () => {
                        if (!admin) {
                            window.location.href = "/accountVoid";
                        }
                        else {
                            window.location.href = "/reservedArea";
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

    // Event handlers for notifications only
    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        // Notification buttons
        const notificationImgs = document.querySelectorAll(".notificationsImg");

        const notificationHandlers = new Map();

        notificationImgs.forEach(element => {
            function handleNotificationClick() {
                setShowNotifications(prev => !prev);
                setShowLoginArea(false);
            };

            notificationHandlers.set(element, handleNotificationClick);
            element.addEventListener("click", handleNotificationClick);
        });

        // Cleanup
        return () => {
            notificationHandlers.forEach((handler, element) => {
                element.removeEventListener("click", handler);
            });
        };
    }, []);



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

            // Order by date (oldest to newest)
            function orderByData(array) {
                return array.sort((a, b) => new Date(a.date) - new Date(b.date));
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
                    element.src = `./images/notifications_active${themeIsLight ? "" : "_Pro"}.svg`;
                });
            }

            // Load notification data into UI
            const notificationsUl = document.querySelectorAll(".notificationsUl");

            notificationsUl.forEach(ul => {
                ul.innerHTML = ""; // Clear existing notifications
                
                notificationsShowOrder.forEach(notification => {
                    const li = document.createElement("li");

                    li.innerHTML = `
                        <div class="notification-item ${notification.status === 0 ? 'unread' : 'read'}">
                            <p>${notification.message}</p>
                            <small>${notification.date}</small>
                            <div class="notification-actions">
                                ${notification.status === 0 ? `<button data-notification-id="${notification.id}" class="mark-read-btn">Mark as Read</button>` : ''}
                                <button data-notification-id="${notification.id}" class="delete-notification-btn">Delete</button>
                            </div>
                        </div>
                    `;

                    ul.appendChild(li);
                });

                // Add event listeners for notification buttons
                ul.querySelectorAll('.mark-read-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const notificationId = parseInt(e.target.dataset.notificationId);
                        await markNotificationAsRead(notificationId);
                    });
                });

                ul.querySelectorAll('.delete-notification-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const notificationId = parseInt(e.target.dataset.notificationId);
                        await deleteNotification(notificationId);
                    });
                });
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

    // Notification management
    async function markNotificationAsRead(notificationId) {
        try {
            const formData = new FormData();
            formData.append("id", notificationId);

            const response = await fetch(getApiUrl('setNotificationAsRead'), {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await response.json();
            
            if (data && data.success) {
                setNotifications(prev => 
                    prev.map(notif => {
                        if (notif.id === notificationId) {
                            return { ...notif, status: 1 };
                        }
                        else {
                            return notif;
                        }
                    })
                );
            }
            
            return data?data.success:false;
        } catch (error) {
            handleError(error, 'markNotificationAsRead');
            return false;
        }
    }

    async function deleteNotification(notificationId) {
        try {
            const formData = new FormData();
            formData.append("id", notificationId);

            const response = await fetch(getApiUrl('deleteNotification'), {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await response.json();
            
            if (data && data.success) {
                setNotifications(prev => 
                    prev.filter(notif => notif.id !== notificationId)
                );
            }
            
            return data?data.success:false;
        } catch (error) {
            handleError(error, 'deleteNotification');
            return false;
        }
    }

    // Utility functions
    function getImagePath(imageName, useThemeVariant = true) {
        if (useThemeVariant) {
            return `/images/${imageName}${themeIsLight ? "" : "_Pro"}.svg`;
        }

        return `/images/${imageName}`;
    }

    function getUserImageSrc(userImage, isAdmin = false) {
        if (isAdmin) {
            return "/images/FreeIdeas_ReservedArea.svg";
        }

        return userImage || getImagePath("user");
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
        markNotificationAsRead,
        deleteNotification,
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