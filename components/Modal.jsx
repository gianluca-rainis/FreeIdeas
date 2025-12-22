import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/CommonContext';
import styles from '../styles/Modal.module.css';

export function Modal({ children, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export function AlertModal({ text, onClose }) {
    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className={`${styles.content}`}>
                <div className={styles.text}>{text}</div>
                <button className={`${styles.button} ${styles.primaryButton}`} onClick={onClose}>Ok</button>
            </div>
        </Modal>
    );
}

export function ConfirmModal({ text, onConfirm, onCancel }) {
    return (
        <Modal isOpen={true} onClose={onCancel}>
            <div className={`${styles.content}`}>
                <div className={styles.text}>{text}</div>
                <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px', justifyContent: 'center', position: 'absolute', width: '100%' }}>
                    <button className={`${styles.button} ${styles.primaryButton}`} onClick={onConfirm} style={{ flex: 1, position: 'static' }}>Yes</button>
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onCancel} style={{ flex: 1, position: 'static' }}>No</button>
                </div>
            </div>
        </Modal>
    );
}

export function PromptModal({ message, defaultValue, onSubmit, onCancel }) {
    const [value, setValue] = useState(defaultValue || '');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(value);
    };

    return (
        <Modal isOpen={true} onClose={onCancel}>
            <div className={`${styles.content} ${styles.promptContent}`}>
                <div className={styles.text}>{message}</div>
                <form onSubmit={handleSubmit} style={{width: '100%', height: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <textarea
                        className={styles.textarea}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        maxLength={10000}
                        autoFocus
                        style={{ width: '90%', margin: '0 auto' }}
                    />
                    <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px', justifyContent: 'center', position: 'absolute', width: '100%' }}>
                        <button type="submit" className={`${styles.button} ${styles.primaryButton}`} style={{ flex: 1, position: 'static' }}>Send</button>
                        <button type="button" className={`${styles.button} ${styles.secondaryButton}`} onClick={onCancel} style={{ flex: 1, position: 'static' }}>Cancel</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}