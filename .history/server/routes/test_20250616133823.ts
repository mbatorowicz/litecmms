import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';

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
  
};

export default testRoutes; 