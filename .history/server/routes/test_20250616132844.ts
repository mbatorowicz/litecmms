import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const testRoutes: FastifyPluginAsync = async function (fastify, opts) {
  
  // Tworzymy własne instancje - bez rozszerzeń typu
  const prisma = new PrismaClient();
  
  // Prosty endpoint testowy BEZ rozszerzeń Fastify
  fastify.get('/test', async (request, reply) => {
    try {
      // Test Prisma - bezpośrednie użycie
      const userCount = await prisma.user.count();
      
      // Test bcrypt - bezpośrednie użycie
      const testPassword = 'test123';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      
      reply.send({
        success: true,
        message: 'Test endpoint działa BEZ rozszerzeń typu!',
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