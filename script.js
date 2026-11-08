let currentLang = 'en';
let memoriesData = [];
let activeAlbum = [];
let activeIndex = 0;
let currentView = 'gallery'; // 'gallery', 'album', or 'fullscreen'
let currentAlbumItem = null;
let buttonTimeout = null;

const i18n = {
    en: {
        subTitle: "Our Memories Archive",
        langBtn: "বাংলা",
        files: "Files",
        backBtn: "← Back to Albums",
        downloadBtn: "Download",
        closeBtn: "✕"
    },
    bn: {
        subTitle: "আমাদের স্মৃতিপট",
        langBtn: "English",
        files: "টি ফাইল",
        backBtn: "← অ্যালবামে ফিরে যান",
        downloadBtn: "ডাউনলোড",
        closeBtn: "✕"
    }
};

async function loadMemories() {
    try {
        const response = await fetch('memories.json');
        memoriesData = await response.json();
        renderGallery();
    } catch (error) {
        console.error("Error loading memories data:", error);
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'bn' : 'en';
    document.getElementById('subTitle').innerText = i18n[currentLang].subTitle;
    document.getElementById('langBtn').innerText = i18n[currentLang].langBtn;
    
    if (currentView === 'gallery') {
        renderGallery();
    } else if (currentView === 'album') {
        renderAlbumView(currentAlbumItem);
    }
}

function renderGallery() {
    currentView = 'gallery';
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    memoriesData.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openAlbum(item);

        const coverMedia = item.media[0];
        let thumbHtml = '';
        if (coverMedia.type === 'video') {
            thumbHtml = `<video src="${coverMedia.url}" muted></video>`;
        } else {
            thumbHtml = `<img src="${coverMedia.url}" alt="${item.title[currentLang]}" loading="lazy">`;
        }

        card.innerHTML = `
            <div class="thumb-container">
                ${thumbHtml}
                <div class="media-badge">📁 📸 ${item.media.length} ${i18n[currentLang].files}</div>
            </div>
            <div class="card-body">
                <div class="card-date">📅 ${item.date}</div>
                <div class="card-title">${item.title[currentLang]}</div>
                <div class="card-desc">${item.description[currentLang]}</div>
            </div>
        `;
        gallery.appendChild(card);
    });
}

function openAlbum(item) {
    currentView = 'album';
    currentAlbumItem = item;
    activeAlbum = item.media;

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 1.5rem;">
            <button onclick="renderGallery()" style="align-self: flex-start; background: rgba(255,255,255,0.1); border: 1px solid var(--glass-border); color: #fff; padding: 0.6rem 1.2rem; border-radius: 12px; cursor: pointer; font-weight: 600; backdrop-filter: blur(10px); transition: background 0.3s;">
                ${i18n[currentLang].backBtn}
            </button>
            <div style="background: var(--bg-card); border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 16px; backdrop-filter: blur(12px);">
                <div style="color: var(--accent); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem;">📅 ${item.date}</div>
                <h2 style="font-size: 1.8rem; margin-bottom: 0.75rem; color: #fff;">${item.title[currentLang]}</h2>
                <p style="color: var(--text-muted); line-height: 1.6;">${item.description[currentLang]}</p>
            </div>
            <div class="sub-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem;" id="subGrid"></div>
        </div>
    `;

    const subGrid = document.getElementById('subGrid');
    activeAlbum.forEach((media, index) => {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = 'sub-thumb';
        thumbDiv.style.cssText = `position: relative; height: 160px; border-radius: 12px; overflow: hidden; cursor: pointer; border: 1px solid var(--glass-border); background: #1e293b; transition: transform 0.3s, box-shadow 0.3s;`;
        
        thumbDiv.onmouseenter = () => { thumbDiv.style.transform = 'translateY(-4px)'; thumbDiv.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)'; };
        thumbDiv.onmouseleave = () => { thumbDiv.style.transform = 'translateY(0)'; thumbDiv.style.boxShadow = 'none'; };
        thumbDiv.onclick = () => openFullscreen(index);

        if (media.type === 'video') {
            thumbDiv.innerHTML = `<video src="${media.url}" style="width: 100%; height: 100%; object-fit: cover;" muted></video>`;
        } else {
            thumbDiv.innerHTML = `<img src="${media.url}" alt="Thumbnail preview" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        subGrid.appendChild(thumbDiv);
    });
}

function renderAlbumView(item) {
    openAlbum(item);
}

function openFullscreen(index) {
    currentView = 'fullscreen';
    activeIndex = index;
    
    let modal = document.getElementById('fullscreenModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'fullscreenModal';
        modal.style.cssText = `display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.96); z-index: 2000; justify-content: center; align-items: center; user-select: none;`;
        modal.innerHTML = `
            <div id="fsContainer" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <div id="fsMediaWrapper" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;"></div>
                
                <div id="fsControls" style="position: absolute; top: 20px; right: 20px; display: flex; gap: 15px; opacity: 0; transition: opacity 0.4s ease; z-index: 2010;">
                    <a id="fsDownloadBtn" download style="background: rgba(59, 130, 246, 0.85); color: white; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); cursor: pointer;">📥 ${i18n[currentLang].downloadBtn}</a>
                    <button id="fsCloseBtn" style="background: rgba(239, 68, 68, 0.85); color: white; border: none; width: 42px; height: 42px; border-radius: 10px; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">✕</button>
                </div>

                <button class="nav-btn nav-prev" id="fsPrev" onclick="event.stopPropagation(); prevMedia();">&#10094;</button>
                <button class="nav-btn nav-next" id="fsNext" onclick="event.stopPropagation(); nextMedia();">&#10095;</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('fsCloseBtn').onclick = (e) => {
            e.stopPropagation();
            closeFullscreen();
        };

        const fsContainer = document.getElementById('fsContainer');
        fsContainer.onclick = () => showControlsTemporarily();
        fsContainer.onmousemove = () => showControlsTemporarily();
    }

    modal.style.display = 'flex';
    updateFullscreenMedia();
    showControlsTemporarily();
}

function updateFullscreenMedia() {
    const wrapper = document.getElementById('fsMediaWrapper');
    wrapper.innerHTML = '';
    const current = activeAlbum[activeIndex];

    const downloadBtn = document.getElementById('fsDownloadBtn');
    downloadBtn.href = current.url;

    if (current.type === 'video') {
        const video = document.createElement('video');
        video.src = current.url;
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
        wrapper.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = current.url;
        img.alt = "Full resolution memory";
        img.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
        wrapper.appendChild(img);
    }
}

function showControlsTemporarily() {
    const controls = document.getElementById('fsControls');
    controls.style.opacity = '1';

    if (buttonTimeout) clearTimeout(buttonTimeout);
    buttonTimeout = setTimeout(() => {
        controls.style.opacity = '0';
    }, 3000);
}

function prevMedia() {
    activeIndex = (activeIndex - 1 + activeAlbum.length) % activeAlbum.length;
    updateFullscreenMedia();
    showControlsTemporarily();
}

function nextMedia() {
    activeIndex = (activeIndex + 1) % activeAlbum.length;
    updateFullscreenMedia();
    showControlsTemporarily();
}

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    if (modal) modal.style.display = 'none';
    currentView = 'album';
}

document.addEventListener('DOMContentLoaded', loadMemories);