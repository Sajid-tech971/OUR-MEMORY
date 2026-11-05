# PABNA PILOT SCHOOL & COLLEGE - Our Memories Website

This project is a dynamic static memory gallery built for Pabna Pilot School & College, designed to be hosted seamlessly on GitHub Pages.

## 📁 File Structure

- `index.html` - Main HTML layout & styling with Bilingual toggle (English & Bangla).
- `script.js` - Dynamic gallery renderer, modal lightbox, and slide handler.
- `memories.json` - Data archive holding all events, titles, descriptions, and media links.
- `media/` - Local folder to store your photos and videos (up to 15 per event).

## 🚀 How to Host on GitHub Pages

1. **Create Repository:** Go to GitHub and create a new repository (e.g., `our-memories`).
2. **Upload Files:** Extract this ZIP archive and upload all files (`index.html`, `script.js`, `memories.json`, and the `media/` folder) into your repository root.
3. **Enable Pages:**
   - Go to Repository **Settings** -> **Pages**.
   - Under **Source**, select `Deploy from a branch`.
   - Choose `main` (or `master`) branch and click **Save**.
4. Your website will be live at: `https://<your-username>.github.io/<repository-name>/`

## ✏️ How to Add New Memories Directly via GitHub

1. Upload your new photos/videos to the `media/` folder in GitHub.
2. Edit `memories.json` in GitHub:
   - Add a new block following the JSON structure:
   ```json
   {
     "id": 3,
     "date": "YYYY-MM-DD",
     "title": {
       "en": "Event Title in English",
       "bn": "ইভেন্টের শিরোনাম বাংলায়"
     },
     "description": {
       "en": "Short description in English",
       "bn": "সংক্ষিপ্ত বিবরণ বাংলায়"
     },
     "media": [
       { "type": "image", "url": "media/photo1.jpg" },
       { "type": "video", "url": "media/video1.mp4" }
     ]
   }
   ```
3. Commit changes! The website will automatically update with your new memories.

---
Created with ❤️ by **MD SADID HASAN SAJID**
