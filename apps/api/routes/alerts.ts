import { FastifyPluginAsync } from 'fastify';

const alertsRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return [];
  });
};

export default alertsRoutes; 