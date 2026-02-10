const axios = require('axios');

module.exports = async (req, res) => {
    // Header wajib untuk komunikasi antar folder
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ status: false, message: 'Gunakan POST' });

    const { url } = req.body;
    if (!url) return res.status(400).json({ status: false, message: 'URL tidak boleh kosong' });

    // Engine Utama: Mendeteksi platform secara otomatis
    const API_ENDPOINT = `https://api.deline.web.id/downloader/aio?url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(API_ENDPOINT, { timeout: 8000 });
        
        if (response.data && response.data.status) {
            // Kita kirimkan semua data hasil scraping (Video, Audio, atau Gambar)
            return res.status(200).json({
                status: true,
                platform: response.data.platform || "Auto-Detected",
                result: response.data.result
            });
        }
        throw new Error("API Failure");

    } catch (err) {
        // Logika Fallback jika API utama gagal
        return res.status(500).json({ 
            status: false, 
            message: "Koneksi ke server pusat terputus. Coba link lain atau ulangi sebentar lagi." 
        });
    }
};
