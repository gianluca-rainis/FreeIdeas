import { AppProvider } from '../contexts/CommonContext';
import { ModalProvider } from '../components/ModalProvider';
import '../styles/styles.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <AppProvider>
            <Component {...pageProps} />
            <ModalProvider />
        </AppProvider>
    );
}