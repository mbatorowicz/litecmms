import { FastifyPluginAsync } from 'fastify';

const usersRoutes: FastifyPluginAsync = async function (fastify, opts) {
  // GET /api/users - Lista użytkowników
  fastify.get('/', async (request, reply) => {
    // TODO: Implementacja listy użytkowników
    reply.send({ message: 'Users API - implementacja w toku' });
  });
};

export default usersRoutes; 