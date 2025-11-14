/**
 * app.js
 * 
 * Main application logic for the OSI Model educational website.
 * 
 * Features:
 *   - Dark mode toggle with localStorage persistence.
 *   - Baconian cipher puzzle interaction (chip reveal, guess checking, hints).
 *   - Keyboard accessibility (Tab, Space, Enter, 'd' for dark mode toggle).
 *   - Smooth animations respecting prefers-reduced-motion.
 *   - Accessible ARIA attributes for interactive elements.
 * 
 * Global function: initializePuzzle(layerName, expectedPlaintext)
 *   Initializes a puzzle on a page. Called from layer4.html and layer5.html.
 */

/**
 * Initialize dark mode toggle and persistence
 */
function initializeDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;

    // Restore saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        updateThemeIcon();
    }

    // Listen for toggle button clicks
    themeToggle.addEventListener('click', toggleDarkMode);

    // Listen for keyboard shortcut (d key)
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'd' || e.key === 'D') && !isTextInputFocused(e)) {
            e.preventDefault();
            toggleDarkMode();
        }
    });
}

/**
 * Toggle dark mode and save preference
 */
function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeIcon();
}

/**
 * Update theme icon based on current mode
 */
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = isDarkMode ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDarkMode ? 'Toggle light mode' : 'Toggle dark mode');
}

/**
 * Check if a text input or textarea is currently focused
 */
function isTextInputFocused(e) {
    const activeElement = document.activeElement;
    return activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
}

/**
 * Reveal a single cipher chip by toggling the revealed class
 * Modified per user request: flip-chip & spacing improvements
 */
function toggleChip(chipCard) {
    if (!chipCard) return;
    
    // Toggle the revealed class for flip-card animation
    const isRevealed = chipCard.classList.toggle('revealed');
    chipCard.setAttribute('aria-pressed', isRevealed);
}

/**
 * Reveal all chips in a puzzle with staggered animation
 * Modified per user request: flip-chip & spacing improvements
 */
function revealAllChips(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const chipCards = container.querySelectorAll('.chip-card');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Stagger reveal animation with 60ms delay between chips
    chipCards.forEach((card, index) => {
        const isRevealed = card.classList.contains('revealed');
        if (!isRevealed) {
            const delay = prefersReducedMotion ? 0 : index * 60;
            setTimeout(() => {
                card.classList.add('revealed');
                card.setAttribute('aria-pressed', 'true');
            }, delay);
        }
    });
}

/**
 * Get the fully decoded plaintext from all chips in a container
 * Modified per user request: flip-chip & spacing improvements
 */
function getDecodedText(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return '';

    const chipCards = container.querySelectorAll('.chip-card');
    let plaintext = '';

    chipCards.forEach(card => {
        const encoded = card.getAttribute('data-group');
        if (encoded) {
            const decoded = window.BaconianCipher.decodeGroup(encoded);
            plaintext += decoded;
        }
    });

    return plaintext;
}

/**
 * Check user's guess against expected plaintext
 */
function checkGuess(layerName, expectedPlaintext) {
    const guessInput = document.getElementById(`${layerName}Guess`);
    const feedbackArea = document.getElementById(`${layerName}Feedback`);
    const hintButton = document.getElementById(`${layerName}Hint`);

    if (!guessInput || !feedbackArea) return;

    const userGuess = window.BaconianCipher.normalizePlaintext(guessInput.value);
    const normalizedExpected = window.BaconianCipher.normalizePlaintext(expectedPlaintext);

    if (userGuess === normalizedExpected) {
        // Correct guess
        feedbackArea.className = 'feedback-area success';
        feedbackArea.textContent = `✓ Correct! The answer is "${expectedPlaintext}". Well done!`;
        if (hintButton) hintButton.style.display = 'none';
    } else if (userGuess === '') {
        // Empty guess
        feedbackArea.className = 'feedback-area hidden';
        feedbackArea.textContent = '';
    } else {
        // Incorrect guess
        feedbackArea.className = 'feedback-area error';
        feedbackArea.textContent = `✗ That's not quite right. Try again!`;
        if (hintButton) hintButton.style.display = 'inline-block';
    }
}

/**
 * Show hint: reveal the first chip's letter
 * Modified per user request: flip-chip & spacing improvements
 */
function showHint(layerName) {
    const chipContainer = document.getElementById(`${layerName}Chips`);
    if (!chipContainer) return;

    const firstCard = chipContainer.querySelector('.chip-card');
    if (firstCard && !firstCard.classList.contains('revealed')) {
        toggleChip(firstCard);
    }
}

/**
 * Initialize a Baconian cipher puzzle on a page
 * @param {string} layerName - Base name for IDs (e.g., 'layer4', 'layer5')
 * @param {string} expectedPlaintext - The correct plaintext answer
 * Modified per user request: flip-chip & spacing improvements
 */
function initializePuzzle(layerName, expectedPlaintext) {
    const chipsContainer = document.getElementById(`${layerName}Chips`);
    const revealAllBtn = document.getElementById(`${layerName}RevealAll`);
    const checkGuessBtn = document.getElementById(`${layerName}CheckGuess`);
    const hintBtn = document.getElementById(`${layerName}Hint`);
    const guessInput = document.getElementById(`${layerName}Guess`);

    if (!chipsContainer) {
        console.warn(`Puzzle container not found for ${layerName}`);
        return;
    }

    // Get all chip cards and initialize them
    const chipCards = chipsContainer.querySelectorAll('.chip-card');

    // Populate decoded letters in chip-back elements on load
    chipCards.forEach(card => {
        const encoded = card.getAttribute('data-group');
        if (encoded) {
            const decoded = window.BaconianCipher.decodeGroup(encoded);
            const backFace = card.querySelector('.chip-back');
            if (backFace) {
                backFace.textContent = decoded;
            }
        }
    });

    // Set up chip click handlers for flip-card toggle
    chipCards.forEach(card => {
        card.addEventListener('click', () => toggleChip(card));

        // Keyboard support: Space and Enter to toggle (prevent scrolling on Space)
        card.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggleChip(card);
            }
        });
    });

    // Set up "Reveal All" button
    if (revealAllBtn) {
        revealAllBtn.addEventListener('click', () => revealAllChips(`${layerName}Chips`));
        
        // Keyboard shortcut: 'r' key to reveal all (but not in text inputs)
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'r' || e.key === 'R') && !isTextInputFocused(e)) {
                e.preventDefault();
                revealAllChips(`${layerName}Chips`);
            }
        });
    }

    // Set up "Check Guess" button
    if (checkGuessBtn) {
        checkGuessBtn.addEventListener('click', () => checkGuess(layerName, expectedPlaintext));

        // Enter key in input field also checks guess
        if (guessInput) {
            guessInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    checkGuess(layerName, expectedPlaintext);
                }
            });
        }
    }

    // Set up "Hint" button
    if (hintBtn) {
        hintBtn.addEventListener('click', () => showHint(layerName));
    }

    // Clear feedback on new input
    if (guessInput) {
        guessInput.addEventListener('input', () => {
            const feedbackArea = document.getElementById(`${layerName}Feedback`);
            if (feedbackArea) {
                feedbackArea.className = 'feedback-area hidden';
                feedbackArea.textContent = '';
            }
        });
    }
}

/**
 * Initialize page on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dark mode
    initializeDarkMode();

    // Navigation active state
    updateActiveNavLink();

    // Handle window resize to update active nav link
    window.addEventListener('resize', updateActiveNavLink);
});

/**
 * Update active nav link based on current page
 */
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href');
        const linkPath = href.split('/').pop() || 'index.html';
        const currentPageName = currentPath.split('/').pop() || 'index.html';

        if (linkPath === currentPageName || (linkPath === 'index.html' && currentPath === '/')) {
            link.classList.add('active');
        }
    });
}

/**
 * Keyboard accessibility: Tab key navigation hints
 * (Subtle: show a tooltip on first Tab press)
 */
let hasShownKeyboardHint = localStorage.getItem('keyboardHintShown');
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !hasShownKeyboardHint && !isTextInputFocused(e)) {
        // Could show a subtle toast here, but keeping it minimal
        localStorage.setItem('keyboardHintShown', 'true');
    }
});

/**
 * Utility: Add a small tooltip or notification (optional, kept minimal)
 */
function showNotification(message, duration = 3000) {
    // Intentionally kept minimal; can be expanded if needed
    console.log(`[Notification] ${message}`);
}

/* ========== README / Deployment Notes (in comments) ==========

DEPLOYMENT GUIDE:

This is a pure static HTML/CSS/JS site with no build tools or backend required.

### Option 1: GitHub Pages
1. Create a new GitHub repository named `<username>.github.io` or push to `<project-name>/docs`
2. Push the files (index.html, layer4.html, layer5.html, styles.css, app.js, baconian.js) to `main` branch
3. In repository settings, enable "GitHub Pages" and select the branch
4. Site will be live at `https://<username>.github.io` or `https://<username>.github.io/<project-name>`

### Option 2: Netlify
1. Push code to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to netlify.com, click "New site from Git", authorize your repo
3. Set build command to: (none/empty) and publish directory to: (root or .)
4. Deploy — Netlify will serve the static files immediately

### Option 3: Vercel
1. Push code to GitHub
2. Go to vercel.com, import your Git project
3. No build configuration needed; accept defaults
4. Deploy with one click

### Option 4: Traditional Web Host
1. Upload all files to your hosting via FTP/SFTP:
   - index.html
   - layer4.html
   - layer5.html
   - styles.css
   - app.js
   - baconian.js
2. Ensure all HTML files point to relative paths (./styles.css, etc.)
3. Keep directory structure flat (no subfolders needed)

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox used (all modern browsers)
- ES6 JavaScript (all modern browsers)
- Graceful degradation for accessibility features

### Performance
- No external libraries or CDN calls
- CSS is inlined (single file)
- JS is modular but not bundled (easy to modify)
- Total bundle: ~60KB uncompressed (very fast)

### Customization
- Edit content in layer4.html and layer5.html
- Modify colors in styles.css CSS custom properties (:root)
- Change cipher plaintexts by modifying baconian.js encodings
- All code is well-commented for easy updates

========== END README ==========

*/

// Console summary of patched files
// Modified per user request: flip-chip & spacing improvements
console.info('%cPatched baconian chip flip and footer text in layer4.html, layer5.html; updated styles.css for flip-card CSS and baseline grid; updated baconian.js with isValidGroup(); updated app.js for chip-card toggling and staggered reveal.', 'color: #27ae60; font-weight: bold;');
