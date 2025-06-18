import { FastifyPluginAsync } from 'fastify';
const workOrderRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Work Orders API - implementacja w toku' });
  });
};
export default workOrderRoutes; 