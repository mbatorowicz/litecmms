import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Ładowanie zmiennych środowiskowych
dotenv.config({ path: 'database.env' });

// TYMCZASOWE ROZWIĄZANIE: Ustawianie DATABASE_URL bezpośrednio
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:8C5c3Aab5@localhost:5432/litecmms?schema=public";
  console.log('⚠️  DATABASE_URL ustawiona tymczasowo w kodzie');
}

// Debug: sprawdź czy DATABASE_URL jest załadowana
console.log('🔍 Katalog roboczy:', process.cwd());
console.log('🔍 DATABASE_URL:', process.env.DATABASE_URL ? 'ZAŁADOWANA' : 'BRAK');
console.log('🔍 DATABASE_URL wartość:', process.env.DATABASE_URL);

// Inicjalizacja Prisma Client
const prisma = new PrismaClient();

// Tworzenie serwera Fastify
const server = Fastify({
  logger: {
    level: 'info'
  }
});

// Rejestracja CORS
server.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true
});

// Funkcja testowania połączenia z bazą danych
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('🔍 Sprawdzanie połączenia z bazą danych...');
    
    // Test prostego zapytania
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Połączenie z bazą danych aktywne');
    return { status: 'ok', message: 'Połączenie z bazą danych aktywne' };
  } catch (error) {
    console.log('⚠️  Baza danych niedostępna - serwer będzie działał w trybie ograniczonym');
    console.error('Database error:', error);
    return { status: 'warning', message: 'Baza danych niedostępna' };
  }
}

// Prosty endpoint health check
server.get('/health', async (request, reply) => {
  return { 
    status: 'ok', 
    message: 'LiteCMMS Server is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  };
});

// Endpoint API status
server.get('/api/status', async (request, reply) => {
  return {
    api: 'LiteCMMS API v2.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health',
      'GET /api/status',
      'GET /api/system-status'
    ]
  };
});

// Endpoint dla statusu systemu (dla frontendu)
server.get('/api/system-status', async (request, reply) => {
  // Testuj połączenie z bazą danych w czasie rzeczywistym
  const dbStatus = await testDatabaseConnection();
  
  return {
    apiServer: {
      status: 'ok',
      message: 'Połączenie aktywne'
    },
    database: dbStatus,
    services: {
      total: 2,
      running: dbStatus.status === 'ok' ? 2 : 1,
      stopped: dbStatus.status === 'ok' ? 0 : 1
    },
    timestamp: new Date().toISOString()
  };
});

// Uruchomienie serwera
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = '0.0.0.0';
    
    // Test połączenia z bazą danych przy starcie
    await testDatabaseConnection();
    
    await server.listen({ port, host });
    
    console.log(`🚀 LiteCMMS Server uruchomiony na http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔌 API Status: http://localhost:${port}/api/status`);
    console.log(`⚙️  System Status: http://localhost:${port}/api/system-status`);
    
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Zamykanie serwera...');
  try {
    await prisma.$disconnect();
    await server.close();
    console.log('✅ Serwer zamknięty pomyślnie');
    process.exit(0);
  } catch (err) {
    console.error('❌ Błąd podczas zamykania:', err);
    process.exit(1);
  }
});

// Start serwera
start(); 