const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// API Utama (AIO Support)
const API_AIO = 'https://api.deline.web.id/downloader/aio?url=';

app.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: 'URL diperlukan' });

    try {
        const response = await axios.get(`${API_AIO}${encodeURIComponent(url)}`, { timeout: 8000 });
        const result = response.data;

        // Pastikan kita hantar data yang konsisten ke Frontend
        if (result && result.status !== false) {
            return res.json({
                status: true,
                platform: url.includes('instagram') ? 'Instagram' : url.includes('youtube') ? 'YouTube' : 'Media',
                data: result.data || result // Mengendalikan pelbagai format
            });
        }
        throw new Error("API Fail");
    } catch (err) {
        res.status(200).json({ 
            status: false, 
            message: "Server sedang sibuk atau URL tidak disokong. Sila cuba lagi." 
        });
    }
});

app.get('/', (req, res) => res.send('All Ridzkey Multi-Downloader Engine is Ready!'));
app.listen(PORT);
