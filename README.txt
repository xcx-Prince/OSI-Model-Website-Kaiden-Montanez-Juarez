<!-- 
    README - OSI Model Educational Site (Layers 4 & 5)
    
    This folder contains a complete static website implementing an interactive
    educational site about OSI Model Layers 4 (Transport) and 5 (Session).
    
    FILES INCLUDED:
    - index.html           : Homepage with navigation and overview
    - layer4.html          : Layer 4 (Transport) detailed page with Baconian puzzle
    - layer5.html          : Layer 5 (Session) detailed page with Baconian puzzle
    - styles.css           : Main stylesheet (light/dark theme, responsive)
    - app.js               : Main application logic (dark mode, puzzle interaction, accessibility)
    - baconian.js          : Baconian cipher decoder (5-bit A/B variant)
    - assets/              : Optional folder for static assets (icons, images)
    
    QUICK START:
    1. Open index.html in a web browser (no server required)
    2. Navigate to Layer 4 or Layer 5 pages
    3. Interact with Baconian cipher puzzles:
       - Click individual cipher chips to reveal letters one at a time
       - Use "Reveal All" to decode the entire message
       - Type your guess in the text input and click "Check Guess"
       - If incorrect, click "Hint" to reveal the first letter
    
    FEATURES:
    ✓ Vanilla HTML/CSS/JavaScript (no frameworks or build tools)
    ✓ Fully responsive design (mobile, tablet, desktop)
    ✓ Light and dark themes with persistent storage
    ✓ Keyboard accessible (Tab, Space, Enter, 'd' for dark mode)
    ✓ Accessible ARIA attributes and semantic HTML
    ✓ Smooth animations (respects prefers-reduced-motion)
    ✓ Self-testing Baconian decoder with console output
    ✓ Clean, well-commented code for easy customization
    
    DEPLOYMENT:
    Upload all files to any static web host:
    - GitHub Pages (free, built-in)
    - Netlify (free tier, easy setup)
    - Vercel (free tier, instant deployment)
    - Traditional web hosting (FTP/SFTP)
    
    No backend, database, or build process required.
    Just upload and serve!
    
    BROWSER SUPPORT:
    - Chrome/Edge (latest)
    - Firefox (latest)
    - Safari (latest)
    - Mobile browsers (iOS Safari, Chrome Mobile)
    
    ACCESSIBILITY:
    - WCAG 2.1 AA compliant
    - Skip links for keyboard users
    - Proper heading hierarchy
    - Color contrast ratios tested
    - Screen reader compatible
    - Keyboard-only navigation supported
    
    CUSTOMIZATION:
    - Colors: Edit CSS custom properties in styles.css (:root)
    - Content: Edit HTML files directly
    - Cipher: Modify baconian.js for new encodings
    - Fonts: Change --font-family-base in styles.css
    
    TECHNICAL DETAILS:
    - CSS Grid and Flexbox for layout
    - CSS custom properties (variables) for theming
    - LocalStorage for dark mode persistence
    - No external dependencies or CDN calls
    - Fast load time (~60KB total)
    - Progressive enhancement (works without JavaScript for basic content)
    
    TESTING:
    Open the browser console (F12) to see:
    - Baconian decoder unit tests on page load
    - Console logging for verify decoder functionality
    - PASS/FAIL indicators for all test cases
    
    TROUBLESHOOTING:
    Q: Dark mode not persisting?
    A: Check browser localStorage settings; ensure cookies/storage not blocked
    
    Q: Cipher chips not responding to clicks?
    A: Check browser console for errors; ensure JavaScript is enabled
    
    Q: Layout broken on mobile?
    A: Check viewport meta tag is present; try refreshing with hard-refresh (Ctrl+Shift+R)
    
    Q: Keyboard shortcuts not working?
    A: Ensure not focused in text input; use 'd' key to toggle dark mode
    
    For questions or issues, review the code comments in each file.
    All code is intentionally readable and well-documented.
    
    Created: November 14, 2025
    
    © 2025 OSI Model Educational Site. Educational Use Only.
-->
