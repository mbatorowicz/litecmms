import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
// import bcryptPlugin from './plugins/bcrypt'; // WYŁĄCZONE
import testRoutes from './routes/test';
// import authRoutes from './routes/auth'; // TYMCZASOWO WYŁĄCZONE
// import { authService } from './services/authService'; // TYMCZASOWO WYŁĄCZONE

// Ładowanie zmiennych środowiskowych
dotenv.config({ path: 'database.env' });

// Sprawdzenie czy DATABASE_URL została załadowana
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL nie została załadowana z database.env');
  console.error('💡 Sprawdź czy plik database.env istnieje i ma poprawny format');
  process.exit(1);
}

// Potwierdzenie poprawnego załadowania konfiguracji
console.log('✅ DATABASE_URL załadowana z database.env');

// Inicjalizacja Prisma Client
const prisma = new PrismaClient();

// Tworzenie serwera Fastify
const server = Fastify({
  logger: {
    level: 'info'
  }
});

// Rejestracja pluginów - krok 2 integracji autoryzacji

// Cookie plugin (wymagany dla JWT)
server.register(cookie);

// JWT plugin
server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  sign: {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  },
  cookie: {
    cookieName: 'token',
    signed: false
  }
});

// Bcrypt plugin - WYŁĄCZONE dla testów
// server.register(bcryptPlugin);

// CORS
server.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true
});

// Prisma Client dostępny globalnie - bez dekoratora
// server.decorate('prisma', prisma); // WYŁĄCZONE - problem z typami

// Test routes - krok 4A prostego podejścia
server.register(testRoutes, { prefix: '/api' });

// Auth routes - TYMCZASOWO WYŁĄCZONE (problemy z typami)
// server.register(authRoutes, { prefix: '/api/auth' });

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
    console.log(`🧪 Test endpoint: http://localhost:${port}/api/test`);
    // console.log(`🔐 Auth - Login: POST http://localhost:${port}/api/auth/login`);
    // console.log(`🔐 Auth - Register: POST http://localhost:${port}/api/auth/register`);
    // console.log(`🔐 Auth - Logout: POST http://localhost:${port}/api/auth/logout`);
    
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Zamykanie serwera...');
  try {
    // await authService.disconnect(); // WYŁĄCZONE
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