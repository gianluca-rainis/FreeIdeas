import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="it">
            <Head>
                {/* Favicon */}
                <link rel="shortcut icon" type="image/svg+xml" href="/images/FreeIdeas.svg" />
                
                {/* CSS - qui vanno i fogli di stile */}
                <link href="/styles/styles.css" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}