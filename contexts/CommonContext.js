import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Save global variables and set the functions to update their values
    const [themeIsLight, setThemeIsLight] = useState(true);
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /* THEME GESTOR */
    // Update the teme
    useEffect(() => {
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
        }
    }, [themeIsLight]);

    // Toggle the theme
    function toggleTheme() {
        const newTheme = !themeIsLight;

        setThemeIsLight(newTheme);

        localStorage.setItem("themeIsLight", newTheme);
    }

    // User management
    useEffect(() => {
        loadUserData();
    }, []);

    async function loadUserData() {
        setIsLoading(true);
        try {
            let response = await fetch('/api/getSessionData.php?data=account', {
                credentials: "include"
            });
            let data = await response.json();

            if (data && data.success) {
                setUser({ ...data, isAdmin: false });
                setNotifications(data.notifications || []);
            } else {
                response = await fetch('/api/getSessionData.php?data=administrator', {
                    credentials: "include"
                });
                data = await response.json();

                if (data && data.success) {
                    setUser({ ...data, isAdmin: true });
                }
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(formData) {
        try {
            const response = await fetch('/api/login.php', {
                credentials: "include",
                method: "POST",
                body: formData
            });
            const data = await response.json();

            if (data && data.success) {
                await loadUserData();
                return { success: true };
            }
            return { success: false, error: "Email or password are wrong" };
        } catch (error) {
            return { success: false, error: "Login failed" };
        }
    }

    async function logout() {
        try {
            await fetch('/api/logout.php', { credentials: "include" });
            setUser(null);
            setNotifications([]);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const value = {
        themeIsLight,
        toggleTheme,
        user,
        notifications,
        isLoading,
        login,
        logout,
        refreshUserData: loadUserData
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