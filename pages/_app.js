import { AppProvider } from '../contexts/CommonContext';
import '../styles/styles.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <AppProvider>
            <Component {...pageProps} />
        </AppProvider>
    );
}