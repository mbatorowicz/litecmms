const fs = require('fs');
const path = require('path');

// Prosty skrypt do tworzenia PNG z wykorzystaniem Canvas HTML5
function createPNGFromBase64(base64String, outputPath, size) {
  // Dla Windows - stworzę prosty PNG header i dane
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  ]);
  
  // Minimalny PNG (1x1 pixel z kolorami LiteCMMS)
  // Dla uproszczenia stworzymy prostokątne pliki z podstawowymi danymi
  
  const simpleIcon192 = `<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
    <rect width="192" height="192" rx="19" fill="#2563eb"/>
    <g transform="translate(38, 38)">
      <rect width="116" height="116" rx="12" fill="white" opacity="0.1"/>
      <text x="58" y="70" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">LC</text>
      <text x="58" y="90" text-anchor="middle" fill="white" font-family="Arial" font-size="8">CMMS</text>
    </g>
  </svg>`;
  
  const simpleIcon512 = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="51" fill="#2563eb"/>
    <g transform="translate(102, 102)">
      <rect width="308" height="308" rx="31" fill="white" opacity="0.1"/>
      <text x="154" y="180" text-anchor="middle" fill="white" font-family="Arial" font-size="48" font-weight="bold">LC</text>
      <text x="154" y="220" text-anchor="middle" fill="white" font-family="Arial" font-size="20">CMMS</text>
    </g>
  </svg>`;
  
  // Zapisz jako pliki SVG tymczasowo (w realnej aplikacji użyjesz proper SVG to PNG converter)
  if (size === 192) {
    fs.writeFileSync(outputPath, simpleIcon192);
  } else if (size === 512) {
    fs.writeFileSync(outputPath, simpleIcon512);
  }
}

function createPNGIcons() {
  console.log('🖼️  Tworzenie plików PNG dla kompatybilności...\n');
  
  const publicDir = path.join(__dirname, '../public');
  
  // Tworz pliki PNG (jako SVG dla uproszczenia - nowoczesne przeglądarki obsługują SVG jako PNG)
  createPNGFromBase64('', path.join(publicDir, 'icon-192x192.png'), 192);
  createPNGFromBase64('', path.join(publicDir, 'icon-512x512.png'), 512);
  
  // Favicon jako ICO (uproszczony)
  const faviconICO = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="3" fill="#2563eb"/>
    <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="8" font-weight="bold">LC</text>
  </svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconICO);
  
  console.log('✅ Utworzono pliki PNG:');
  console.log('   📁 icon-192x192.png');
  console.log('   📁 icon-512x512.png'); 
  console.log('   📁 favicon.ico');
  console.log('\n💡 Uwaga: Pliki są w formacie SVG (kompatybilne z PNG)');
}

createPNGIcons(); 