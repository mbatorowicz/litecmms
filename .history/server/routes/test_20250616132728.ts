import { FastifyPluginAsync } from 'fastify';

const testRoutes: FastifyPluginAsync = async function (fastify, opts) {
  
  // Prosty endpoint testowy dla Prisma i bcrypt
  fastify.get('/test', async (request, reply) => {
    try {
      // Test Prisma - sprawdzenie połączenia z bazą
      const userCount = await fastify.prisma.user.count();
      
      // Test bcrypt - hashowanie tekstu testowego
      const testPassword = 'test123';
      const hashedPassword = await fastify.bcrypt.hash(testPassword, 10);
      const isValid = await fastify.bcrypt.compare(testPassword, hashedPassword);
      
      reply.send({
        success: true,
        message: 'Test endpoint działa!',
        tests: {
          prisma: {
            connected: true,
            userCount: userCount
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