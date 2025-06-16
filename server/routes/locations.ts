import { FastifyPluginAsync } from 'fastify';

const locationRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Locations API - implementacja w toku' });
  });
};

export default locationRoutes; 