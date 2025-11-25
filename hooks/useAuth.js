import { useAppContext } from '../contexts/CommonContext';
import { useRouter } from 'next/router';

export function useAuth() {
    const { 
        user, 
        login, 
        logout, 
        forgotPassword, 
        isLoading, 
        refreshUserData,
        showAlert 
    } = useAppContext();
    const router = useRouter();

    async function handleLogin(formData) {
        try {
            const result = await login(formData);
            if (result.success) {
                router.push('/');

                return { success: true };
            }
            else {
                await showAlert(result.error || "Email or password are wrong");

                return { success: false, error: result.error };
            }
        } catch (error) {
            await showAlert("Login failed");

            return { success: false, error: "Login failed" };
        }
    };

    async function handleLogout() {
        await logout();
    };

    async function handleForgotPassword(email) {
        try {
            const result = await forgotPassword(email);
            await showAlert(result.message);

            return { success: true };
        } catch (error) {
            await showAlert(error.message || "Failed to send password reset email");
            
            return { success: false, error: error.message };
        }
    };

    function redirectToAccount() {
        if (user && user.isAdmin) {
            router.push('/reservedArea');
        }
        else {
            router.push('/accountVoid');
        }
    };

    return {
        user,
        isLoading,
        isLoggedIn: !!user,
        isAdmin: user?.isAdmin || false,
        handleLogin,
        handleLogout,
        handleForgotPassword,
        redirectToAccount,
        refreshUserData
    };
}