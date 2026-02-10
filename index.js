function renderResult(data) {
    const container = document.getElementById('resultSection');
    const content = document.getElementById('resultContent');
    container.classList.remove('hidden');

    // Ambil data utama dari response API Deline
    const result = data.data || data; 
    let html = '';
    
    // 1. Tampilkan Thumbnail jika ada
    const thumb = result.thumbnail || result.cover || result.image || (result.metadata ? result.metadata.thumbnail : null);
    if(thumb) {
        html += `<img src="${thumb}" class="w-full md:w-48 rounded-lg object-cover shadow-md mb-4 md:mb-0">`;
    }

    html += `<div class="flex-1 w-full text-sm">`;
    
    // 2. Tampilkan Judul
    const title = result.title || result.caption || 'Berhasil Menemukan File';
    html += `<h4 class="font-bold text-lg mb-2 line-clamp-2">${title}</h4>`;

    // 3. Tombol Download Otomatis (Mencari link MP4/MP3)
    // Mencari di berbagai kemungkinan key: url, video, mp4, link
    const downloadUrl = result.url || result.video || result.link || (result.metadata ? result.metadata.video : null);
    
    if (downloadUrl) {
        html += createDownloadButton(downloadUrl, "Download Video (MP4)");
    } 

    // Jika ada audio/music
    const audioUrl = result.audio || result.music || (result.metadata ? result.metadata.audio : null);
    if (audioUrl) {
        html += createDownloadButton(audioUrl, "Download Audio (MP3)");
    }

    // Backup: Jika API memberikan array media (seperti Instagram Carousel)
    if (result.media && Array.isArray(result.media)) {
        result.media.forEach((item, i) => {
            html += createDownloadButton(item.url || item, `Download Media ${i+1}`);
        });
    }

    if (!downloadUrl && !audioUrl && !result.media) {
        html += `<p class="text-yellow-400">Gagal mengekstrak link download. Coba tempel ulang URL-nya.</p>`;
    }

    html += `</div>`;
    content.innerHTML = html;
}
