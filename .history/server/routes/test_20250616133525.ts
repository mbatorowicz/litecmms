import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { authService } from '../services/authService';

const testRoutes: FastifyPluginAsync = async function (fastify, opts) {
  
  // Prosty endpoint testowy BEZ rozszerzeń Fastify
  fastify.get('/test', async (request, reply) => {
    try {
      // Test Prisma przez AuthService - bezpieczne podejście  
      const userCount = await authService.findUserByEmail('test@test.com') ? 1 : 0; // Test query
      
      // Test bcrypt - bezpośrednie użycie
      const testPassword = 'test123';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      
              reply.send({
          success: true,
          message: 'Test endpoint działa z AuthService (bezpieczne podejście)!',
                  tests: {
            prisma: {
              connected: true,
              testQuery: userCount
          },
          bcrypt: {
            working: true,
            testPassword: testPassword,
            hashedPassword: hashedPassword,
            validationPassed: isValid
          },
          jwt: {
            available: 'fastify.jwt' in fastify
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
  
};

export default testRoutes; 