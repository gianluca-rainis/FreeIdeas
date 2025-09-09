<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

    <xsl:template match="/">
        <html>
            <head>
                <title>FreeIdeas - Sitemap</title>

                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 2em;
                        color: #333;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    th, td {
                        padding: 8px 12px;
                        border-bottom: 1px solid #ccc;
                    }

                    th {
                        background-color: #f0f0f0;
                        text-align: left;
                    }

                    tr:hover {
                        background-color: #eef;
                    }
                </style>
            </head>
            <body>
                <h1>FreeIdeas Sitemap</h1>

                <table>
                    <tr>
                        <th>URL</th>
                        <th>Priority</th>
                    </tr>
                    <xsl:for-each select="//sm:url">
                        <tr>
                            <td>
                                <a href="{loc}">
                                    <xsl:value-of select="loc"/>
                                </a>
                            </td>
                            <td>
                                <xsl:value-of select="priority"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>