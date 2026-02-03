import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en-US">
            <Head>
                {/* Favicon */}
                <link rel="shortcut icon" type="image/svg+xml" href="/images/FreeIdeas.svg" />
                
                {/* Prevent theme flash by loading theme before render */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function() {
                            const savedTheme = localStorage.getItem('themeIsLight');
                            let isDark = false;
                            
                            if (savedTheme !== null) {
                                isDark = savedTheme === 'false';
                            }
                            else {
                                // Check system preference
                                isDark = !window.matchMedia('(prefers-color-scheme: light)').matches;
                            }
                            
                            if (isDark) {
                                document.documentElement.setAttribute('data-theme', 'dark');
                            }
                            else {
                                document.documentElement.setAttribute('data-theme', 'light');
                            }
                        })();`,
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}