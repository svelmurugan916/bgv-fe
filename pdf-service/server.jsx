import React from 'react';
// 1. Set React globally so components don't crash if they miss the import
global.React = React;

import express from 'express';
import cors from 'cors';
import { renderToString } from 'react-dom/server';
import puppeteer from 'puppeteer';

// 2. Import the component
import VantiraBGVReportComponent from '../src/component/report/VantiraBGVReport.jsx';
const VantiraBGVReport = VantiraBGVReportComponent.default || VantiraBGVReportComponent;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
    try {
        const reportData = req.body;

        // 3. Render React to HTML string
        const bodyHtml = renderToString(React.createElement(VantiraBGVReport, { reportData }));

        // 4. Create the full HTML document with Page-Break logic
        const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Report PDF</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
          <style>
            body { 
                font-family: 'Inter', sans-serif; 
                background-color: #0a1020; /* Dark background for the cover */
                margin: 0;
                padding: 0;
            }
            
            /* FORCE COLORS */
            * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
            }

            /* THE FIX: Prevent splitting of cards and tables */
            /* This ensures a div or table row is never cut in half across pages */
            section, 
            .card, 
            table, 
            tr, 
            .break-inside-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
            }

            /* Ensure images don't get cut */
            img {
                break-inside: avoid;
            }

            /* Helper class for manual page breaks if needed */
            .page-break { 
                break-before: page !important; 
                page-break-before: always !important; 
            }

            ::-webkit-scrollbar { display: none; }
          </style>
        </head>
        <body>
            <div id="root">${bodyHtml}</div>
        </body>
      </html>
    `;

        // 5. Launch Puppeteer (Using local Chrome to avoid Mac crashes)
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 6. Set content and wait for assets
        await page.setContent(finalHtml, {
            waitUntil: ['networkidle0', 'domcontentloaded']
        });

        // 7. Generate the PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            displayHeaderFooter: false,
        });

        await browser.close();

        // 8. Send PDF
        res.contentType("application/pdf");
        res.send(pdf);

    } catch (err) {
        console.error("PDF Generation Error:", err);
        res.status(500).send(`Error generating PDF: ${err.message}`);
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 PDF Generator Service ready at http://localhost:${PORT}`);
});
