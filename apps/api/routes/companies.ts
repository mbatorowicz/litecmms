import { FastifyPluginAsync } from 'fastify';

const companyRoutes: FastifyPluginAsync = async function (fastify, opts) {
  // GET /api/companies - Lista firm
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Companies API - implementacja w toku' });
  });
};

export default companyRoutes; 