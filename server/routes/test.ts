import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';

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
  
};

export default testRoutes; 