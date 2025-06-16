const dotenv = require('dotenv');

console.log('=== TEST ŁADOWANIA database.env ===');
console.log('Katalog roboczy:', process.cwd());

// Test 1: Sprawdź czy plik istnieje
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), 'database.env');
console.log('Ścieżka do pliku:', envPath);
console.log('Plik istnieje:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('Zawartość pliku:');
  console.log(fs.readFileSync(envPath, 'utf8'));
}

// Test 2: DATABASE_URL przed ładowaniem
console.log('\n--- PRZED dotenv.config ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Test 3: Ładowanie z database.env
console.log('\n--- ŁADOWANIE database.env ---');
const result = dotenv.config({ path: 'database.env' });
console.log('Wynik dotenv.config:', result);

// Test 4: DATABASE_URL po ładowaniu
console.log('\n--- PO dotenv.config ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Test 5: Wszystkie zmienne środowiskowe zawierające "DATABASE"
console.log('\n--- WSZYSTKIE ZMIENNE Z "DATABASE" ---');
Object.keys(process.env)
  .filter(key => key.includes('DATABASE'))
  .forEach(key => {
    console.log(`${key}:`, process.env[key]);
  }); 