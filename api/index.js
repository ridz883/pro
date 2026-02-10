const axios = require('axios');

module.exports = async (req, res) => {
    // Tambahkan Header CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Gunakan POST' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'URL Kosong' });

    const DELINE_API = "https://api.deline.web.id/downloader/aio?url=";

    try {
        // Step 1: Coba Engine Utama
        const response = await axios.get(`${DELINE_API}${encodeURIComponent(url)}`, { timeout: 4000 });
        
        if (response.data && response.data.status) {
            return res.status(200).json(response.data);
        }
        throw new Error("API Utama Error");

    } catch (err) {
        // Step 2: Fallback (Nanti kita isi dengan skrip scraping manual)
        console.error("Beralih ke scraping...");
        return res.status(500).json({ 
            status: false, 
            message: "Server sedang sibuk, silakan coba kembali beberapa saat lagi." 
        });
    }
};
