async function startDownload() {
    const input = document.getElementById('urlInput');
    const result = document.getElementById('result');
    const status = document.getElementById('status');
    const btn = document.getElementById('btnDl');

    // Validasi input agar tidak kosong
    if (!input.value) {
        return alert("Masukkan URL terlebih dahulu!");
    }

    // Aktifkan loading state
    status.classList.remove('hidden');
    result.classList.add('hidden');
    btn.disabled = true;

    try {
        /* PERUBAHAN STRATEGIS: 
           Memanggil endpoint '/api' secara langsung agar sesuai dengan 
           konfigurasi vercel.json yang mengarah ke api/index.js
        */
        const response = await fetch('/api', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ url: input.value })
        });
        
        // Cek jika server memberikan respon selain 200 OK
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        // Jika data berhasil diambil dari API Deline atau Scraping Fallback
        if (data.status) {
            let resHtml = `
                <div class="p-6 bg-slate-950 border border-blue-900/30 rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
                    <p class="text-xs font-bold text-blue-500 uppercase mb-4 tracking-widest">Konten Berhasil Diambil</p>
            `;
            
            // Logika Universal: Menampilkan tombol berdasarkan ketersediaan MP4/MP3/URL
            const media = data.result;
            
            if (media.mp4 || media.url) {
                resHtml += `
                    <a href="${media.mp4 || media.url}" target="_blank" 
                       class="block w-full bg-blue-600 py-4 text-center rounded-xl font-bold mb-3 hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">
                       <i class="fa-solid fa-video mr-2"></i> DOWNLOAD VIDEO (MP4)
                    </a>`;
            }
            
            if (media.mp3 || media.audio) {
                resHtml += `
                    <a href="${media.mp3 || media.audio}" target="_blank" 
                       class="block w-full bg-emerald-600 py-4 text-center rounded-xl font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40">
                       <i class="fa-solid fa-music mr-2"></i> DOWNLOAD AUDIO (MP3)
                    </a>`;
            }
            
            resHtml += `</div>`;
            result.innerHTML = resHtml;
            result.classList.remove('hidden');
        } else {
            // Error dari API (misal link tidak valid)
            alert(data.message || "Gagal memproses link tersebut.");
        }
    } catch (e) {
        // Error koneksi atau 404
        console.error("Hacking log:", e);
        alert("Gagal terhubung ke Backend. Pastikan file api/index.js sudah ter-deploy di Vercel.");
    } finally {
        // Matikan loading state
        status.classList.add('hidden');
        btn.disabled = false;
    }
}
