let currentLang = 'en';
let memoriesData = [];
let activeAlbum = [];
let activeIndex = 0;

const i18n = {
    en: {
        subTitle: "Our Memories Archive",
        langBtn: "বাংলা",
        files: "Files"
    },
    bn: {
        subTitle: "আমাদের স্মৃতিপট",
        langBtn: "English",
        files: "টি ফাইল"
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
    renderGallery();
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    memoriesData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openModal(index);

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
                <div class="media-badge">📸 ${item.media.length} ${i18n[currentLang].files}</div>
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

function openModal(index) {
    const item = memoriesData[index];
    activeAlbum = item.media;
    activeIndex = 0;

    document.getElementById('mTitle').innerText = item.title[currentLang];
    document.getElementById('mDate').innerText = `📅 ${item.date}`;
    document.getElementById('mDesc').innerText = item.description[currentLang];

    updateModalMedia();
    document.getElementById('modal').style.display = 'flex';
}

function updateModalMedia() {
    const container = document.getElementById('mediaContainer');
    container.innerHTML = '';
    const current = activeAlbum[activeIndex];

    if (current.type === 'video') {
        const video = document.createElement('video');
        video.src = current.url;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '100%';
        container.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = current.url;
        img.alt = "Memory image";
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        container.appendChild(img);
    }
}

function prevMedia() {
    activeIndex = (activeIndex - 1 + activeAlbum.length) % activeAlbum.length;
    updateModalMedia();
}

function nextMedia() {
    activeIndex = (activeIndex + 1) % activeAlbum.length;
    updateModalMedia();
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('mediaContainer').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', loadMemories);
