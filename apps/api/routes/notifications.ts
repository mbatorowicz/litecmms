import { FastifyPluginAsync } from 'fastify';
const notificationRoutes: FastifyPluginAsync = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    reply.send({ message: 'Notifications API - implementacja w toku' });
  });
};
export default notificationRoutes; 