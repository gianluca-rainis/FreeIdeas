import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getApiUrl } from '../utils/apiConfig';
import { handleError, getUserFriendlyErrorMessage, ValidationError } from '../utils/errorHandling';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Save global variables and set the functions to update their values
    const [themeIsLight, setThemeIsLight] = useState(true);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [randomIdeaId, setRandomIdeaId] = useState(null);
    const [showLoginArea, setShowLoginArea] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    
    const router = useRouter();

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
            if (window.location.pathname.includes("/about.php")) {
                const aboutLogo = document.querySelector(".footerpage")?.querySelector(".logo");
                if (aboutLogo) {
                    logos.push(aboutLogo);
                }
            }

            if (window.location.pathname.includes("/contacts.php")) {
                const contactsLogo = document.querySelector(".footerpage")?.querySelector(".logo");
                if (contactsLogo) {
                    logos.push(contactsLogo);
                }
            }

            if (window.location.pathname.includes("/index.php") || window.location.pathname === "/") {
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
                } else if (element.src.includes("/images/notifications")) {
                    element.src = `./images/notifications${isLight ? "" : "_Pro"}.svg`;
                }
            });

            // Update page-specific icons
            if (window.location.href.includes("/publishAnIdea.php")) {
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

            if (window.location.href.includes("/accountVoid.php")) {
                const publishedAccount = document.getElementById("publishedAccount");
                const savedAccount = document.getElementById("savedAccount");
                
                if (publishedAccount?.children.item(0)) {
                    publishedAccount.children.item(0).src = `./images/publish${isLight ? "" : "_Pro"}.svg`;
                }

                if (savedAccount?.children.item(0)) {
                    savedAccount.children.item(0).src = `./images/saved${isLight ? "" : "_Pro"}.svg`;
                }
            }

            if (window.location.href.includes("/ideaVoid.php")) {
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
        loadUserData();
    }, []);

    async function loadUserData() {
        setIsLoading(true);

        try {
            let response = await fetch(`${getApiUrl('getSessionData')}?data=account`, {
                credentials: "include"
            });

            let data = await response.json();

            if (data && data.success) {
                setUser({ ...data, isAdmin: false });
                setNotifications(data.notifications || []);
            }
            else {
                response = await fetch(`${getApiUrl('getSessionData')}?data=administrator`, {
                    credentials: "include"
                });
                data = await response.json();

                if (data && data.success) {
                    setUser({ ...data, isAdmin: true });
                }
            }
        } catch (error) {
            handleError(error, 'loadUserData');
            setUser(null);
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(formData) {
        try {
            const response = await fetch(getApiUrl('login'), {
                credentials: "include",
                method: "POST",
                body: formData
            });
            
            const data = await response.json();

            if (data && data.success) {
                await loadUserData();
                return { success: true };
            }
            return { 
                success: false,
                error: getUserFriendlyErrorMessage(data?data.error:null || "Invalid email or password")
            };
        } catch (error) {
            const errorInfo = handleError(error, 'login');
            return { 
                success: false,
                error: getUserFriendlyErrorMessage(error)
            };
        }
    }

    async function logout() {
        try {
            await fetch(getApiUrl('logout'), { credentials: "include" });
            setUser(null);
            setNotifications([]);
            router.push('/');
        } catch (error) {
            handleError(error, 'logout');
            // Anche se il logout fallisce, pulisci lo stato locale
            setUser(null);
            setNotifications([]);
        }
    }

    // Login/Navigation area management
    function toggleLoginArea() {
        if (!showLoginArea) {
            setShowLoginArea(true);
            setShowNotifications(false);
        }
        else {
            setShowLoginArea(false);
        }
    }

    function toggleNotifications() {
        if (!showNotifications) {
            setShowNotifications(true);
            setShowLoginArea(true);
        }
        else {
            setShowNotifications(false);
            setShowLoginArea(false);
        }
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

    // Forgot password functionality
    async function forgotPassword(email) {
        if (!email || !email.includes("@") || !email.includes(".")) {
            throw new ValidationError("Insert a valid email", "email");
        }

        try {
            const formData = new FormData();
            formData.append("email", email);

            const response = await fetch(getApiUrl('changePassword'), {
                credentials: "include",
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data && data.success) {
                return { success: true, message: `Email sent to: ${email}` };
            }
            else {
                throw new Error(data?.error || "Failed to send password reset email");
            }
        } catch (error) {
            handleError(error, 'forgotPassword');
            throw error;
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
        // Theme
        themeIsLight,
        toggleTheme,
        
        // User and authentication
        user,
        isLoading,
        login,
        logout,
        refreshUserData: loadUserData,
        forgotPassword,
        
        // Notifications
        notifications,
        markNotificationAsRead,
        deleteNotification,
        
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