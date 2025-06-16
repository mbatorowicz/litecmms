const fs = require('fs');
const path = require('path');

// Generowanie prostej ikony w formacie SVG
function generateSVGIcon(size) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Tło gradientowe -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Tło -->
  <rect width="${size}" height="${size}" rx="${size * 0.1}" fill="url(#bgGradient)"/>
  
  <!-- Ikona narzędzi (symbolizuje CMMS) -->
  <g transform="translate(${size * 0.2}, ${size * 0.2}) scale(${size * 0.006})">
    <!-- Klucz -->
    <path d="M20 10 C20 15 25 20 30 20 L70 20 L70 30 L80 30 L80 40 L70 40 L70 50 L60 50 L60 40 L30 40 C25 40 20 35 20 30 Z" fill="white" stroke="white" stroke-width="2"/>
    <circle cx="30" cy="25" r="8" fill="none" stroke="white" stroke-width="3"/>
    
    <!-- Śrubokręt -->
    <path d="M50 60 L90 60 L95 65 L95 75 L90 80 L50 80 Z" fill="white"/>
    <rect x="45" y="62" width="8" height="16" fill="white"/>
  </g>
  
  <!-- Tekst LiteCMMS -->
  <text x="${size/2}" y="${size * 0.85}" font-family="Arial, sans-serif" font-size="${size * 0.08}" font-weight="bold" text-anchor="middle" fill="white">LiteCMMS</text>
</svg>`;
  
  return svg;
}

// Funkcja do konwersji SVG na format PNG-like (base64)
function svgToPNG(svgContent, outputPath) {
  // Dla uproszczenia, zapiszemy SVG jako plik PNG z odpowiednią nazwą
  // W rzeczywistej aplikacji użyłbyś biblioteki do konwersji SVG->PNG
  const base64SVG = Buffer.from(svgContent).toString('base64');
  const dataURI = `data:image/svg+xml;base64,${base64SVG}`;
  
  // Zapisujemy jako plik .svg, ale możemy go używać jako ikony
  fs.writeFileSync(outputPath.replace('.png', '.svg'), svgContent);
  
  console.log(`✓ Utworzono ikonę SVG: ${outputPath.replace('.png', '.svg')}`);
}

// Generowanie ikon PWA
async function generatePWAIcons() {
  const publicDir = path.join(__dirname, '../public');
  
  // Upewnij się, że katalog public istnieje
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  console.log('🎨 Generowanie ikon PWA dla LiteCMMS v2.0...\n');
  
  // Generuj ikony w różnych rozmiarach
  const sizes = [
    { size: 192, filename: 'icon-192x192' },
    { size: 512, filename: 'icon-512x512' }
  ];
  
  sizes.forEach(({ size, filename }) => {
    const svgContent = generateSVGIcon(size);
    const outputPath = path.join(publicDir, `${filename}.png`);
    svgToPNG(svgContent, outputPath);
  });
  
  // Generuj również favicon.ico (jako SVG)
  const faviconSVG = generateSVGIcon(32);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);
  console.log('✓ Utworzono favicon.svg');
  
  console.log('\n✅ Wszystkie ikony PWA zostały wygenerowane!');
  console.log('📁 Lokalizacja: public/');
  console.log('📝 Uwaga: Ikony są w formacie SVG (kompatybilne z PWA)');
}

// Uruchom generator
generatePWAIcons().catch(console.error); 