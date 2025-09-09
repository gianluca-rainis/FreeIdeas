<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

    <xsl:template match="/">
        <html>
            <head>
                <!-- Special version of the head.php file -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link rel="shortcut icon" type="image/svg+xml" href="https://freeideas.duckdns.org/favicon.svg" />

                <meta name="description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta name="author" content="Gianluca Rainis" />
                <meta name="keywords" content="FreeIdeas, Free, Ideas, Sitemap, sitemap" />
                <meta name="application-name" content="FreeIdeas" lang="en" />

                <meta property="og:url" content="https://freeideas.duckdns.org/" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="FreeIdeas" />
                <meta property="og:title" content="FreeIdeas" />
                <meta property="og:description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta property="og:image" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />
                <meta property="og:image:secure_url" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="FreeIdeas preview image" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="freeideas.duckdns.org">
                <meta name="twitter:url" content="https://freeideas.duckdns.org/" />
                <meta name="twitter:title" content="FreeIdeas" />
                <meta name="twitter:description" content="FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project." />
                <meta name="twitter:image" content="https://freeideas.duckdns.org/images/freeideasPreview.png" />

                <script type="application/ld+json">
                    {
                        "@content": "https://schema.org",
                        "@type": "WebSite",
                        "name": "FreeIdeas",
                        "url": "https://freeideas.duckdns.org"
                    }
                </script>

                <!-- End of special version of the head.php file -->

                <title>FreeIdeas - Sitemap</title>
                <link rel="canonical" href="https://freeideas.duckdns.org/sitemap.xml" />

                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        margin: 2em;
                        color: #333;
                        text-align: center;
                        background-color: #f6ffd7;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        padding: 8px 12px;
                        border-bottom: 1px solid #106d19;
                    }

                    th {
                        background-color: #f8f095;
                        text-align: left;
                    }

                    tr:hover {
                        background-color: rgb(214, 233, 144);
                    }
                </style>
            </head>
            <body>
                <h1>
                    <a style="color: #59ff97;">F</a><a style="color: #47dc55;">r</a><a style="color: #05a814;">e</a><a style="color: #106d19;">e</a><a style="color: #ffcf00;">I</a><a style="color: #f4d54b;">d</a><a style="color: #e4c53d;">e</a><a style="color: #c0a634;">a</a><a style="color: #a28710;">s</a>
                     Sitemap
                </h1>

                <table>
                    <tr>
                        <th>URL</th>
                        <th>Priority</th>
                    </tr>
                    <xsl:for-each select="//sm:url">
                        <tr>
                            <td>
                                <a href="{sm:loc}">
                                    <xsl:value-of select="sm:loc" />
                                </a>
                            </td>
                            <td>
                                <xsl:value-of select="sm:priority" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>