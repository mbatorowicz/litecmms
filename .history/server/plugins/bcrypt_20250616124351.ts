import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';

interface BcryptInterface {
  hash: (password: string, saltRounds: number) => Promise<string>;
  compare: (password: string, hash: string) => Promise<boolean>;
}

const bcryptPlugin: FastifyPluginAsync = async function (fastify) {
  const bcryptInterface: BcryptInterface = {
    hash: (password: string, saltRounds: number = 12) => bcrypt.hash(password, saltRounds),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash)
  };

  fastify.decorate('bcrypt', bcryptInterface);
};

export default bcryptPlugin; 