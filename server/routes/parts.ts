import { FastifyPluginAsync } from 'fastify';
const partRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Parts API - implementacja w toku' });
  });
};
export default partRoutes; 