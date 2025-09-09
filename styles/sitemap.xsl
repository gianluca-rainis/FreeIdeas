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
                        text-align: center;
                        background-color: #f6ffd7;
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
                        background-color: #f8f095;
                        text-align: left;
                    }

                    tr:hover {
                        background-color: #eef;
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