import { useState, useCallback } from 'react';
import { useAppContext } from '../contexts/CommonContext';

export function useModals() {
    const { themeIsLight } = useAppContext();
    const [currentModal, setCurrentModal] = useState(null);

    const showAlert = useCallback((text) => {
        return new Promise((resolve) => {
            setCurrentModal({
                type: 'alert',
                text,
                resolve,
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
                resolve,
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
                resolve,
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
        if (currentModal?currentModal.onCancel:false) {
            currentModal.onCancel();
        }
        else if (currentModal?currentModal.onClose:false) {
            currentModal.onClose();
        }
        else {
            setCurrentModal(null);
        }
    }, [currentModal]);

    return {
        currentModal,
        showAlert,
        showConfirm,
        showPrompt,
        closeModal
    };
}