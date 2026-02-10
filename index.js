const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
app.use(cors());

const API_AIO = 'https://api.deline.web.id/downloader/aio?url=';

app.get('/get-link', async (req, res) => {
    try {
        const response = await axios.get(`${API_AIO}${encodeURIComponent(req.query.url)}`, { timeout: 8000 });
        const d = response.data.data || response.data;
        const finalUrl = d.video || d.url || d.link || (d.media ? d.media[0].url : null);
        
        if (finalUrl) {
            return res.json({ status: true, downloadUrl: finalUrl, title: d.title || "Ridzkey Video" });
        }
        res.json({ status: false, message: "Link video tidak ditemukan." });
    } catch (e) {
        res.json({ status: false, message: "Server API sedang sibuk." });
    }
});

app.listen(3000);
