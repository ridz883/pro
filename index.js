const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// Engine Scraping Sederhana (Mencari MP4 langsung dari source)
async function getMediaUrl(targetUrl) {
    // API Utama sebagai base scraper
    const api = `https://api.deline.web.id/downloader/aio?url=${encodeURIComponent(targetUrl)}`;
    const res = await axios.get(api, { timeout: 10000 });
    const d = res.data.data || res.data;
    return d.video || d.url || d.link || (d.media ? d.media[0].url : null);
}

app.get('/proxy-download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL Needed");

    try {
        const mediaUrl = await getMediaUrl(url);
        if (!mediaUrl) throw new Error("Link tidak ditemukan");

        const response = await axios({
            method: 'get',
            url: mediaUrl,
            responseType: 'stream'
        });

        const totalLength = response.headers['content-length'];
        
        // Header agar browser mendownload file, bukan memutar
        res.setHeader('Content-Disposition', 'attachment; filename="Ridzkey_Downloader.mp4"');
        res.setHeader('Content-Type', 'video/mp4');
        if (totalLength) res.setHeader('Content-Length', totalLength);

        // Kirim stream data ke browser
        response.data.pipe(res);

    } catch (err) {
        res.status(500).send("Scraping gagal: " + err.message);
    }
});

app.listen(3000);
