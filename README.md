# Portfolio Website

This repository contains a client‑side portfolio website that can be deployed directly to GitHub Pages.

## Project Structure
```
portfolio/
├─ index.html      # Main HTML page
├─ style.css       # Global styles (glassmorphism, responsive layout)
├─ script.js       # GSAP animations and interactions
├─ assets/         # Images, icons, etc. (optional)
├─ .nojekyll      # Prevents GitHub Pages from ignoring files
└─ README.md       # This file
```

## Local Development
1. Clone the repository.
2. Open `index.html` in a web browser (no server required).
3. Verify that the sections load and animations trigger.
4. Edit `style.css` or `script.js` to customize colors, fonts, or animations.

## Deploy to GitHub Pages
1. Create a new repository on GitHub (e.g., `username/portfolio`).
2. Push the contents of this folder to the `main` branch.
3. In the repository settings, enable **GitHub Pages** and select the `main` branch as the source.
4. After a few minutes, the site will be available at `https://<username>.github.io/<repo>/`.

## Customization
- **Fonts**: Change the Google Font link in `index.html`.
- **Colors/Gradients**: Edit the background gradients in `style.css`.
- **Animations**: Modify the GSAP timelines in `script.js`.

---
*Built with HTML, CSS, JavaScript, GSAP, and a macOS‑Tahoe inspired design.*
