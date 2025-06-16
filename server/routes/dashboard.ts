import { FastifyPluginAsync } from 'fastify';
const dashboardRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Dashboard API - implementacja w toku' });
  });
};
export default dashboardRoutes; 