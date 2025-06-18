import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';

const bcryptPlugin: FastifyPluginAsync = async function (fastify) {
  const bcryptInterface = {
    hash: async (password: string, saltRounds: number = 12) => bcrypt.hash(password, saltRounds),
    compare: async (password: string, hash: string) => bcrypt.compare(password, hash)
  };

  fastify.decorate('bcrypt', bcryptInterface);
};

export default bcryptPlugin; 