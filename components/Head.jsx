import React from 'react'
import HeadNext from 'next/head'

export default function Head({ pageTitle="", pageUrl="https://freeideas.duckdns.org/" }) {
    return (
        <>
            <HeadNext>
                <title>{pageTitle ? `FreeIdeas - ${pageTitle}` : 'FreeIdeas'}</title>
                <link rel="canonical" href={pageUrl} />

                <meta name="description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta name="author" content="Gianluca Rainis" />
                <meta name="keywords" content="FreeIdeas, Free, Ideas" />
                <meta name="application-name" content="FreeIdeas" lang="en" />
                
                {/* Open Graph */}
                <meta property="og:url" content={pageUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="FreeIdeas" />
                <meta property="og:title" content={pageTitle || 'FreeIdeas'} />
                <meta property="og:description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta property="og:image" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />
                <meta property="og:image:secure_url" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="FreeIdeas preview image" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="freeideas.duckdns.org" />
                <meta name="twitter:url" content={pageUrl} />
                <meta name="twitter:title" content={pageTitle || 'FreeIdeas'} />
                <meta name="twitter:description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta name="twitter:image" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />
                
                {/* Favicon and CSS are in _document.js */}
                
                {/* JSON-LD Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@type": "WebSite",
                            "@context": "https://schema.org",
                            "name": "FreeIdeas",
                            "url": "https://freeideas.duckdns.org"
                        })
                    }}
                />
            </HeadNext>
        </>
    )
}