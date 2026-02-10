const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// URL API Cadangan jika Deline down
const API_PRIMARY = 'https://api.deline.web.id/downloader/aio?url=';
const API_BACKUP = 'https://api.tiklydown.eu.org/api/download?url='; 

app.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'URL diperlukan' });

    try {
        // ENGINE 1: API DELINE
        const response = await axios.get(`${API_PRIMARY}${encodeURIComponent(url)}`, { timeout: 5000 });
        if (response.data && response.data.status !== false) {
            return res.json(response.data);
        }
        throw new Error("Deline Down");
    } catch (err) {
        console.log("Switching to Backup Engine...");
        try {
            // ENGINE 2: API CADANGAN (Tiklydown untuk TikTok)
            if (url.includes('tiktok.com')) {
                const backup = await axios.get(`${API_BACKUP}${encodeURIComponent(url)}`);
                // Format ulang agar sesuai dengan yang diharapkan Frontend
                return res.json({
                    status: true,
                    data: {
                        title: backup.data.data.title || "TikTok Video",
                        thumbnail: backup.data.data.cover,
                        video: backup.data.data.video.no_watermark,
                        audio: backup.data.data.music.play_url
                    }
                });
            }
            throw new Error("No Backup Available");
        } catch (finalErr) {
            // KIRIM JSON, BUKAN TEKS (Agar tidak muncul error 'Unexpected token A')
            res.status(200).json({ 
                status: false, 
                message: "Server sedang sibuk, silakan coba beberapa saat lagi." 
            });
        }
    }
});

app.get('/', (req, res) => res.send('Engine Ready!'));
app.listen(PORT);
