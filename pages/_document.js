import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en-US">
            <Head>
                {/* Favicon */}
                <link rel="shortcut icon" type="image/svg+xml" href="/images/FreeIdeas.svg" />
                
                {/* CSS */}
                <link href="/styles/styles.css" rel="stylesheet" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}