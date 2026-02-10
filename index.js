const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- KONFIGURASI ENGINE ---
const PRIMARY_API_URL = 'https://api.deline.web.id/downloader/aio?url=';
const TIMEOUT_LIMIT = 3000; // 3 Detik

// --- 1. PRIMARY ENGINE (API) ---
async function fetchFromPrimaryAPI(targetUrl) {
    try {
        const response = await axios.get(`${PRIMARY_API_URL}${targetUrl}`, {
            timeout: TIMEOUT_LIMIT
        });
        if (response.data && response.data.status !== false) {
            return { source: 'API', data: response.data };
        }
        throw new Error("API Response Invalid");
    } catch (error) {
        throw error;
    }
}

// --- 2. SECONDARY ENGINE (SCRAPING FALLBACK) ---
async function fetchFromScraperFallback(targetUrl) {
    console.log(`[System] Switching to Scraping Mode for: ${targetUrl}`);
    // Simulasi fallback sederhana
    return { 
        source: 'Fallback', 
        status: true,
        data: {
            title: "Mode Fallback Aktif (API Utama Sibuk)",
            url: targetUrl // Di real case ini hasil scraping
        }
    };
}

// --- MAIN ENDPOINT ---
app.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    try {
        const result = await fetchFromPrimaryAPI(url);
        return res.json(result.data);
    } catch (apiError) {
        try {
            const scrapeResult = await fetchFromScraperFallback(url);
            return res.json(scrapeResult);
        } catch (scrapeError) {
            return res.status(503).json({
                status: false,
                message: "Server sedang sibuk, silakan coba kembali."
            });
        }
    }
});

// Endpoint default agar tidak 404 saat dibuka root url-nya
app.get('/', (req, res) => {
    res.send('All Ridzkey Downloader Engine is Running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
