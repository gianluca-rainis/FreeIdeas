import { usePasswordVisibility } from '../hooks/usePasswordVisibility';
import styles from '../styles/PasswordToggle.module.css';

export function PasswordInput({ id, name, value, onChange, placeholder, className = '', required = false, autoComplete = 'current-password' }) {
    const { isVisible, toggleVisibility, getInputType, getToggleIcon } = usePasswordVisibility();

    return (
        <div className={`${styles.passwordContainer} ${className}`}>
            <input
                id={id}
                name={name}
                type={getInputType()}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                className={styles.passwordInput}
            />
            <button
                type="button"
                className={styles.toggleButton}
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
            >
                {getToggleIcon()}
            </button>
        </div>
    );
}