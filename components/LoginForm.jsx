import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../contexts/CommonContext';
import { PasswordInput } from './PasswordInput';
import styles from '../styles/LoginForm.module.css';

export function LoginForm({ onClose }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { handleLogin, handleForgotPassword } = useAuth();
    const { themeIsLight } = useAppContext();

    function handleChange(e) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);

        const result = await handleLogin(formDataToSend);
        
        if (result.success && onClose) {
            onClose();
        }
        
        setIsSubmitting(false);
    };

    async function handleForgotPasswordClick() {
        if (!formData.email) {
            // Focus email input if empty
            if (document.getElementById('emailAreaLogin')) {
                document.getElementById('emailAreaLogin').focus();
            }
            return;
        }
        
        await handleForgotPassword(formData.email);
    };

    return (
        <form id="loginAccountForm" className={`${styles.loginForm} ${themeIsLight ? styles.light : styles.dark}`} onSubmit={handleSubmit}>
            <h2>Login</h2>
            
            <div className={styles.inputGroup}>
                <input
                    id="emailAreaLogin"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroup}>
                <PasswordInput
                    id="passwordAreaLogin"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
            </div>

            <div className={styles.buttonGroup}>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`${styles.button} ${styles.primaryButton}`}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
                
                <button 
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className={`${styles.button} ${styles.secondaryButton}`}
                    disabled={isSubmitting}
                >
                    Forgot Password?
                </button>
            </div>
        </form>
    );
}