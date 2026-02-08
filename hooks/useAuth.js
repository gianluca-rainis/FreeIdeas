import { useState } from 'react';
import { useAppContext } from '../contexts/CommonContext';
import { useRouter } from 'next/router';
import { apiCall } from '../utils/apiConfig';
import { handleError, ValidationError } from '../utils/errorHandling';

export function useAuth() {
    const { 
        user, 
        isLoading, 
        refreshUserData,
        showAlert,
        toggleLoginArea 
    } = useAppContext();
    const router = useRouter();
    
    // States to handle logins
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API functions for authentication
    async function login(formData) {
        try {
            const data = await apiCall('login', {
                method: "POST",
                body: formData
            });

            if (data && data.success) {
                return { success: true };
            }
            else {
                return { 
                    success: false,
                    error: "Email or password are wrong"
                };
            }
        } catch (error) {
            console.error(error);
            return { 
                success: false,
                error: "Network error"
            };
        }
    }

    async function logout() {
        try {
            await apiCall('logout');
        } catch (error) {
            console.error(error);
        }
        
        // Redirect
        window.location.href = "/";
    }

    async function forgotPassword(email) {
        if (!email || !email.includes("@") || !email.includes(".")) {
            throw new ValidationError("Insert a valid email", "email");
        }

        try {
            const formData = new FormData();
            formData.append("email", email);

            const data = await apiCall('changePassword', {
                method: "POST",
                body: formData
            });

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

    // Change data login handler
    function handleLoginChange(e) {
        setLoginData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    // Handle submit form login
    async function handleLoginSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('email', loginData.email);
        formData.append('password', loginData.password);
        
        try {
            const result = await login(formData);
            
            if (result.success) {
                await refreshUserData();

                setLoginData({ email: '', password: '' }); // Reset form

                window.location.href = window.location.href;

                return { success: true };
            }
            else {
                await showAlert(result.error || "Email or password are wrong");
                return { success: false, error: result.error };
            }
        } catch (error) {
            await showAlert("Login failed");
            return { success: false, error: "Login failed" };
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleLogout() {
        await logout();
    }

    // Handle forgot password
    async function handleForgotPassword() {
        if (!loginData.email || !loginData.email.includes("@") || !loginData.email.includes(".")) {
            await showAlert("Insert a valid email");
            return;
        }
        
        try {
            const result = await forgotPassword(loginData.email);

            await showAlert(result.message);
            return { success: true };
        } catch (error) {
            await showAlert(error.message || "Failed to send password reset email");
            return { success: false, error: error.message };
        }
    }

    // Handle click on user image or menu
    function handleUserImageClick() {
        toggleLoginArea();
    }

    function redirectToAccount() {
        if (user && user.isAdmin) {
            router.push('/reservedArea');
        }
        else {
            router.push('/account');
        }
    }

    return {
        // User state
        user,
        isLoading,
        isLoggedIn: !!user,
        isAdmin: user?.isAdmin || false,
        
        // Login form state
        loginData,
        isSubmitting,
        
        // Handlers
        handleLoginChange,
        handleLoginSubmit,
        handleLogout,
        handleForgotPassword,
        handleUserImageClick,
        redirectToAccount,
        refreshUserData
    };
}