import { FastifyPluginAsync } from 'fastify';

const machineRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Machines API - implementacja w toku' });
  });
};

export default machineRoutes; 