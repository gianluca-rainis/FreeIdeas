import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { apiCall } from '../utils/apiConfig';
import { handleError } from '../utils/errorHandling';
import { useThemeImages } from '../hooks/useThemeImages';

const AppContext = createContext();

function createEmptyNotificationRow() {
    const li = document.createElement('li');
    const titleAndDate = document.createElement('div');
    const title = document.createElement('strong');
    const date = document.createElement('div');
    const content = document.createElement('div');

    titleAndDate.style.display = 'flex';
    date.style.color = 'grey';
    titleAndDate.append(title, document.createTextNode(' - '), date);
    li.append(titleAndDate, content);

    return li;
}

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
        router.events.on('routeChangeComplete', loadRandomIdea);

        return () => {
            router.events.off('routeChangeComplete', loadRandomIdea);
        };
    }, [router, loadRandomIdea]);

    // User management
    useEffect(() => {
        ldAccountData();
    }, []);

    // Reload account data when navigating between pages
    const reloadAccountData = useCallback(() => {
        ldAccountData();
    }, []);
    
    useEffect(() => {
        router.events.on('routeChangeComplete', reloadAccountData);

        return () => {
            router.events.off('routeChangeComplete', reloadAccountData);
        };
    }, [router, reloadAccountData]);

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
            const res = await apiCall('/api/getSessionData?data=account');

            return res;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getSessionDataAdminFromDatabase() {
        try {
            const res = await apiCall('/api/getSessionData?data=administrator');

            return res;
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
                userNameElement.textContent = SQLdata.username;
            }

            // Update PC login block
            const pcLoginSignUpBlock = document.getElementById("pcLoginSignUpBlock");

            if (pcLoginSignUpBlock) {
                const heading = document.createElement('h2');
                const image = document.createElement('img');
                const name = document.createElement('h3');
                const accountButton = document.createElement('button');
                const logoutButton = document.createElement('button');

                heading.textContent = `Welcome ${SQLdata.username}`;
                image.src = userImageDisplayed;
                image.alt = 'User Image';
                image.style.cssText = 'width: 60px; height: 60px; text-align: center; margin-bottom: 40px; margin-top: 30px;';
                name.textContent = `${SQLdata.name || ''} ${SQLdata.surname || ''}`;
                name.style.marginBottom = '20px';
                accountButton.type = 'submit';
                accountButton.id = 'sendAccountButton';
                accountButton.textContent = 'Account';
                logoutButton.type = 'submit';
                logoutButton.id = 'sendLogoutButton';
                logoutButton.textContent = 'Log Out';
                pcLoginSignUpBlock.replaceChildren(heading, image, name, accountButton, logoutButton);
            }

            // Update mobile login block
            const mobileLoginSignUpBlock = document.getElementById("mobileLoginSignUpBlock");

            if (mobileLoginSignUpBlock) {
                const heading = document.createElement('h2');
                const imageContainer = document.createElement('div');
                const image = document.createElement('img');
                const name = document.createElement('h3');
                const buttonContainer = document.createElement('div');
                const accountButton = document.createElement('button');
                const logoutButton = document.createElement('button');

                heading.textContent = `Welcome ${SQLdata.username}`;
                image.src = userImageDisplayed;
                image.alt = 'User Image';
                image.style.cssText = 'width: 100px; height: 100px; text-align: center; margin-bottom: 40px; margin-top: 30px;';
                imageContainer.style.alignItems = 'center';
                imageContainer.appendChild(image);
                name.textContent = `${SQLdata.name || ''} ${SQLdata.surname || ''}`;
                name.style.marginBottom = '20px';
                accountButton.type = 'submit';
                accountButton.id = 'sendAccountButtonMobile';
                accountButton.textContent = 'Account';
                logoutButton.type = 'submit';
                logoutButton.id = 'sendLogoutButtonMobile';
                logoutButton.textContent = 'Log Out';
                buttonContainer.style.alignItems = 'center';
                buttonContainer.append(accountButton, logoutButton);
                mobileLoginSignUpBlock.replaceChildren(heading, imageContainer, name, buttonContainer);
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
                ul.replaceChildren();
                
                notificationsShowOrder.forEach(notification => {
                    const li = document.createElement("li");
                    const dataETitle = document.createElement("div");
                    const title = document.createElement("strong");
                    const date = document.createElement("div");
                    const content = document.createElement("div");

                    title.textContent = notification.title;
                    date.textContent = notification.data;
                    date.style.color = 'grey';
                    dataETitle.style.display = "flex";
                    dataETitle.append(title, document.createTextNode(' - '), date);
                    content.textContent = `${String(notification.description || '').substring(0, 30)}...`;

                    li.appendChild(dataETitle);
                    li.appendChild(content);

                    if (notification.status == 0) {
                        li.classList = "unReadNotification";
                    }

                    li.dataset.notificationId = notification.id;
                    li.dataset.notificationTitle = notification.title || '';
                    li.dataset.notificationDate = notification.data || '';
                    li.dataset.fullDescription = notification.description || '';

                    ul.appendChild(li);
                });

                // Add event listeners for notification buttons
                ul.querySelectorAll("li[data-notification-id]").forEach(li => li.addEventListener("click", () => {
                    ul.style.display = "none";
                    document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "block");

                    document.querySelectorAll(".hiddenNotificationData").forEach(element => {
                        const heading = document.createElement('h3');
                        const title = document.createElement('strong');
                        const date = document.createElement('div');
                        const description = document.createElement('p');
                        const actions = document.createElement('div');
                        const backImage = document.createElement('img');
                        const deleteButton = document.createElement('input');

                        heading.style.cssText = 'display: flex; justify-content: center;';
                        heading.append(title, document.createTextNode(' - '), date);
                        title.textContent = li.dataset.notificationTitle;
                        date.textContent = li.dataset.notificationDate;
                        date.style.color = 'grey';
                        description.textContent = li.dataset.fullDescription;
                        actions.style.cssText = 'display: flex; justify-content: center; align-items: center;';
                        backImage.id = 'notificationBackImage';
                        backImage.src = `/images/back${themeIsLight ? '' : '_Pro'}.svg`;
                        backImage.alt = 'Back';
                        deleteButton.id = 'notificationDeleteButton';
                        deleteButton.type = 'button';
                        deleteButton.value = 'Delete';
                        element.replaceChildren(heading, document.createElement('br'), description, actions);
                        actions.append(backImage, deleteButton);
                    });

                    /* Back button */
                    document.getElementById("notificationBackImage").addEventListener("click", async () => {
                        ul.style.display = "block";
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.style.display = "none");

                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.replaceChildren());

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
                                console.error(`ERROR 421: UNABLE TO DELETE NOTIFICATION ${idToDelete}.`);
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
                        
                        document.querySelectorAll(".hiddenNotificationData").forEach(element => element.replaceChildren());

                        const idToDelete = li.dataset.notificationId;

                        li.remove();

                        if (document.querySelectorAll("unReadNotification").length == 0) {
                            notificationPc.forEach(element => element.src = `/images/notifications${themeIsLight?"":"_Pro"}.svg`);
                        }

                        if (notificationsShowOrder.length < 6) {
                            for (let index = 0; index < (6 - notificationsShowOrder.length); index++) {
                                ul.appendChild(createEmptyNotificationRow());
                            }
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
                                console.error(`ERROR 421: UNABLE TO DELETE NOTIFICATION ${idToDelete}.`);
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
                        ul.appendChild(createEmptyNotificationRow());
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