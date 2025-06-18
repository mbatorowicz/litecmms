/// <reference path="./types/fastify.d.ts" />
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
// import bcryptPlugin from './plugins/bcrypt';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';
import alertsRoutes from './routes/alerts';
import dashboardRoutes from './routes/dashboard';
import companiesRoutes from './routes/companies';
import locationsRoutes from './routes/locations';
import machinesRoutes from './routes/machines';
import usersRoutes from './routes/users';
import workOrdersRoutes from './routes/work-orders';
import partsRoutes from './routes/parts';
import notificationsRoutes from './routes/notifications';

// Ładowanie zmiennych środowiskowych
dotenv.config({ path: 'database.env' });

// Konfiguracja środowiska
const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  databaseUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};

// Tworzenie serwera Fastify z enhanced loggingiem
const server = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'warn' : 'info'
  }
});

// Sprawdzenie wymaganych zmiennych środowiskowych
if (!config.databaseUrl) {
  server.log.error('❌ DATABASE_URL nie została załadowana z database.env');
  server.log.error('💡 Sprawdź czy plik database.env istnieje i ma poprawny format');
  process.exit(1);
}

// Potwierdzenie poprawnego załadowania konfiguracji
server.log.info('✅ DATABASE_URL załadowana z database.env');

// Inicjalizacja Prisma Client
const prisma = new PrismaClient();

// Rejestracja Prisma jako dekorator
server.decorate('prisma', prisma);

// Rejestracja pluginów
server.register(cookie);
// server.register(bcryptPlugin);

// JWT plugin
server.register(jwt, {
  secret: config.jwtSecret,
  sign: {
    expiresIn: config.jwtExpiresIn
  },
  cookie: {
    cookieName: 'token',
    signed: false
  }
});

// CORS
server.register(cors, {
  origin: config.frontendUrl,
  credentials: true
});

// Middleware autoryzacji
server.register(authMiddleware);

// Routes
server.register(testRoutes, { prefix: '/api' });
server.register(authRoutes, { prefix: '/api/auth' });
server.register(alertsRoutes, { prefix: '/api/alerts' });
server.register(dashboardRoutes, { prefix: '/api/dashboard' });
server.register(companiesRoutes, { prefix: '/api/companies' });
server.register(locationsRoutes, { prefix: '/api/locations' });
server.register(machinesRoutes, { prefix: '/api/machines' });
server.register(usersRoutes, { prefix: '/api/users' });
server.register(workOrdersRoutes, { prefix: '/api/work-orders' });
server.register(partsRoutes, { prefix: '/api/parts' });
server.register(notificationsRoutes, { prefix: '/api/notifications' });

// Funkcja testowania połączenia z bazą danych
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    server.log.info('🔍 Sprawdzanie połączenia z bazą danych...');
    
    // Test prostego zapytania
    await prisma.$queryRaw`SELECT 1`;
    server.log.info('✅ Połączenie z bazą danych aktywne');
    return { status: 'ok', message: 'Połączenie z bazą danych aktywne' };
  } catch (error) {
    server.log.warn('⚠️  Baza danych niedostępna - serwer będzie działał w trybie ograniczonym');
    server.log.error('Database error:', error);
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
    // Test połączenia z bazą danych przy starcie
    await testDatabaseConnection();
    
    await server.listen({ port: config.port, host: config.host });
    
    server.log.info(`🚀 LiteCMMS Server uruchomiony na http://localhost:${config.port}`);
    server.log.info(`📊 Health check: http://localhost:${config.port}/health`);
    server.log.info(`🔌 API Status: http://localhost:${config.port}/api/status`);
    server.log.info(`⚙️  System Status: http://localhost:${config.port}/api/system-status`);
    server.log.info(`🧪 Test endpoint: http://localhost:${config.port}/api/test`);
    server.log.info(`🔐 Auth - Login: POST http://localhost:${config.port}/api/auth/login`);
    server.log.info(`🔐 Auth - Register: POST http://localhost:${config.port}/api/auth/register`);
    server.log.info(`🔐 Auth - Logout: POST http://localhost:${config.port}/api/auth/logout`);
    
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  server.log.info('\n🛑 Zamykanie serwera...');
  try {
    // await authService.disconnect();
    await prisma.$disconnect();
    await server.close();
    server.log.info('✅ Serwer zamknięty pomyślnie');
    process.exit(0);
  } catch (err) {
    server.log.error('❌ Błąd podczas zamykania:', err);
    process.exit(1);
  }
});

// Start serwera
start(); 