// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const DELINE_API = "https://api.deline.web.id/downloader/aio?url=";

// Mock function untuk Scraping Fallback
async function scrapingFallback(url) {
    // Di sini kamu masukkan logika scraping (Puppeteer/Cheerio)
    // Sesuai kebutuhan platform masing-masing
    throw new Error("Scraping engine sedang maintenance."); 
}

app.post('/api/download', async (req, res) => {
    const { url } = req.body;
    
    // 1. Coba API Utama (Deline)
    try {
        const response = await axios.get(`${DELINE_API}${encodeURIComponent(url)}`, { timeout: 3000 });
        if (response.data && response.data.status) {
            return res.json({ success: true, source: 'API', data: response.data });
        }
        throw new Error("API Invalid Response");
    } catch (err) {
        console.log("API Gagal, beralih ke Scraping...");
        
        // 2. Fallback ke Scraping Engine
        try {
            const scrapData = await scrapingFallback(url);
            return res.json({ success: true, source: 'Scraping', data: scrapData });
        } catch (scrapErr) {
            // 3. Final Error Handling
            return res.status(500).json({ 
                success: false, 
                message: "Server sedang sibuk, silakan coba kembali." 
            });
        }
    }
});

app.listen(3000, () => console.log('Ridzkey Downloader running on port 3000'));
