import { FastifyPluginAsync } from 'fastify';
import * as bcrypt from 'bcryptjs';
import { authService } from '../services/authService';

// Interface dla decoratorów autoryzacji
interface FastifyWithAuth {
  authenticate: (request: any, reply: any) => Promise<void>;
  authorize: (roles: string[]) => (request: any, reply: any) => Promise<void>;
}

const testRoutes: FastifyPluginAsync = async function (fastify, opts) {
  
  // Prosty endpoint testowy BEZ rozszerzeń Fastify
  fastify.get('/test', async (request, reply) => {
    try {
      // Test podstawowy - bez Prisma na razie
      const testResult = 'Test połączenia - OK';
      
      // Test bcrypt - bezpośrednie użycie
      const testPassword = 'test123';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      
                      reply.send({
          success: true,
          message: 'Test endpoint działa (podstawowa wersja)!',
          tests: {
            basic: {
              working: true,
              result: testResult
            },
          bcrypt: {
            working: true,
            testPassword: testPassword,
            hashedPassword: hashedPassword,
            validationPassed: isValid
          },
                      jwt: {
              available: !!fastify.jwt
            }
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        success: false,
        error: 'Test endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Chroniony endpoint testowy - używa manual authentication check
  fastify.get('/test-secure', async (request, reply) => {
    try {
      // Manual check tokena autoryzacji
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        reply.code(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'No token provided'
        });
        return;
      }

      // Weryfikacja JWT
      try {
        const decoded = await request.jwtVerify() as any;
        
        reply.send({
          success: true,
          message: 'Test chronionego endpoint działa!',
          auth: {
            method: 'manual verification',
            userId: decoded.id,
            userEmail: decoded.email
          },
          timestamp: new Date().toISOString()
        });
      } catch (jwtError) {
        reply.code(401).send({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid or expired token'
        });
      }
      
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        success: false,
        error: 'Test secure endpoint error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/test - podstawowy test
  fastify.get('/', async (request, reply) => {
    reply.send({ 
      message: 'LiteCMMS API działa poprawnie!',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  });

  // GET /api/test/test-users - sprawdź użytkowników w bazie (test endpoint)
  fastify.get('/test-users', async (request, reply) => {
    try {
      const users = await fastify.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          company: {
            select: {
              name: true
            }
          }
        }
      });

      reply.send({
        message: 'Lista użytkowników',
        count: users.length,
        users: users
      });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Nie można pobrać listy użytkowników'
      });
    }
  });

  // POST /api/test/login - test logowania
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as { email: string; password: string };
      
      if (!email || !password) {
        return reply.code(400).send({
          error: 'Brak danych',
          message: 'Email i hasło są wymagane'
        });
      }

      // Znajdź użytkownika
      const user = await authService.findUserByEmail(email);
      
      if (!user) {
        return reply.code(404).send({
          error: 'Użytkownik nie znaleziony',
          message: `Użytkownik z emailem ${email} nie istnieje`
        });
      }

      // Sprawdź hasło
      const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);
      
      reply.send({
        message: 'Test logowania',
        email: email,
        userExists: !!user,
        passwordValid: isPasswordValid,
        userInfo: user ? {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive
        } : null
      });

    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Błąd podczas testu logowania'
      });
    }
  });
};

export default testRoutes; 