const fs = require('fs');
const path = require('path');

// Profesjonalne ikony PWA - na podstawie wzoru użytkownika
function generateProfessionalIcon(size) {
  const iconSVG = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient background -->
  <defs>
    <linearGradient id="bgGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e7dd8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1565c0;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow${size}">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Main background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bgGrad${size})" filter="url(#shadow${size})"/>
  
  <!-- Inner content area -->
  <g transform="translate(${size * 0.15}, ${size * 0.15})">
    <!-- Gear wheel -->
    <g transform="translate(${size * 0.35}, ${size * 0.25}) scale(${size * 0.008})">
      <path d="M50 15 L55 20 L65 18 L70 23 L80 25 L82 35 L92 40 L90 50 L82 55 L80 65 L70 67 L65 72 L55 70 L50 75 L45 70 L35 72 L30 67 L20 65 L18 55 L8 50 L10 40 L18 35 L20 25 L30 23 L35 18 L45 20 Z" 
            fill="white" opacity="0.95"/>
      <circle cx="50" cy="50" r="15" fill="#1565c0"/>
      <circle cx="50" cy="50" r="8" fill="white"/>
    </g>
    
    <!-- Wrench/Key tool -->
    <g transform="translate(${size * 0.45}, ${size * 0.45}) scale(${size * 0.006}) rotate(45)">
      <rect x="0" y="15" width="60" height="8" rx="4" fill="white" opacity="0.95"/>
      <rect x="55" y="10" width="8" height="18" rx="4" fill="white" opacity="0.95"/>
      <rect x="50" y="5" width="8" height="28" rx="4" fill="white" opacity="0.95"/>
      <circle cx="8" cy="19" r="12" fill="none" stroke="white" stroke-width="6" opacity="0.95"/>
    </g>
  </g>
  
  <!-- Professional highlight -->
  <rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.3}" 
        rx="${size * 0.1}" fill="url(#bgGrad${size})" opacity="0.2"/>
</svg>`;

  return iconSVG;
}

// Maskable icon (okrągła wersja)
function generateMaskableIcon(size) {
  const iconSVG = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="maskGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e7dd8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1565c0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Circular background -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#maskGrad${size})"/>
  
  <!-- Content area -->
  <g transform="translate(${size * 0.2}, ${size * 0.2})">
    <!-- Gear -->
    <g transform="translate(${size * 0.25}, ${size * 0.15}) scale(${size * 0.006})">
      <path d="M50 15 L55 20 L65 18 L70 23 L80 25 L82 35 L92 40 L90 50 L82 55 L80 65 L70 67 L65 72 L55 70 L50 75 L45 70 L35 72 L30 67 L20 65 L18 55 L8 50 L10 40 L18 35 L20 25 L30 23 L35 18 L45 20 Z" 
            fill="white"/>
      <circle cx="50" cy="50" r="12" fill="#1565c0"/>
    </g>
    
    <!-- Wrench -->
    <g transform="translate(${size * 0.35}, ${size * 0.35}) scale(${size * 0.005}) rotate(45)">
      <rect x="0" y="15" width="50" height="6" rx="3" fill="white"/>
      <rect x="45" y="12" width="6" height="12" rx="3" fill="white"/>
      <circle cx="6" cy="18" r="8" fill="none" stroke="white" stroke-width="4"/>
    </g>
  </g>
</svg>`;

  return iconSVG;
}

// Favicon (mała wersja)
function generateFavicon(size) {
  const iconSVG = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="favGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e7dd8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1565c0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#favGrad${size})"/>
  
  <!-- Simple gear icon -->
  <g transform="translate(${size/2}, ${size/2}) scale(${size * 0.025})">
    <path d="M0,-8 L2,-6 L6,-7 L8,-5 L7,-1 L9,1 L8,5 L6,7 L2,6 L0,8 L-2,6 L-6,7 L-8,5 L-7,1 L-9,-1 L-8,-5 L-6,-7 L-2,-6 Z" 
          fill="white"/>
    <circle cx="0" cy="0" r="3" fill="#1565c0"/>
  </g>
</svg>`;

  return iconSVG;
}

function createProfessionalIcons() {
  console.log('🎨 Tworzenie profesjonalnych ikon PWA...\n');
  
  const publicDir = path.join(__dirname, '../public');
  
  // Główne ikony PWA
  const icon192 = generateProfessionalIcon(192);
  const icon512 = generateProfessionalIcon(512);
  
  // Maskable icon (okrągła)
  const maskable192 = generateMaskableIcon(192);
  const maskable512 = generateMaskableIcon(512);
  
  // Favicon
  const favicon = generateFavicon(32);
  
  // Zapisz pliki
  fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), icon192);
  fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), icon512);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), favicon);
  
  // Dodatkowe wersje dla kompatybilności
  fs.writeFileSync(path.join(publicDir, 'icon-192x192.png'), icon192);
  fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), icon512);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon);
  
  // Maskable versions
  fs.writeFileSync(path.join(publicDir, 'icon-192x192-maskable.svg'), maskable192);
  fs.writeFileSync(path.join(publicDir, 'icon-512x512-maskable.svg'), maskable512);
  
  console.log('✅ Utworzono profesjonalne ikony PWA:');
  console.log('   📱 icon-192x192.svg (główna ikona)');
  console.log('   📱 icon-512x512.svg (wysoka jakość)');
  console.log('   🔗 favicon.svg (zakładki)');
  console.log('   ⭕ icon-*-maskable.svg (adaptacyjne)');
  console.log('   📄 Pliki PNG dla kompatybilności');
  console.log('\n🎯 Styl: Profesjonalny niebieski z symbolami CMMS');
}

createProfessionalIcons(); 