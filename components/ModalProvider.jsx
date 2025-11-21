import { useAppContext } from '../contexts/CommonContext';
import { AlertModal, ConfirmModal, PromptModal } from './Modal';

export function ModalProvider() {
    const { currentModal } = useAppContext();

    if (!currentModal) return null;

    switch (currentModal.type) {
        case 'alert':
            return (
                <AlertModal
                    text={currentModal.text}
                    onClose={currentModal.onClose}
                />
            );
        case 'confirm':
            return (
                <ConfirmModal
                    text={currentModal.text}
                    onConfirm={currentModal.onConfirm}
                    onCancel={currentModal.onCancel}
                />
            );
        case 'prompt':
            return (
                <PromptModal
                    message={currentModal.message}
                    defaultValue={currentModal.defaultValue}
                    onSubmit={currentModal.onSubmit}
                    onCancel={currentModal.onCancel}
                />
            );
        default:
            return null;
    }
}