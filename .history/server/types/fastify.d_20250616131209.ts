import '@fastify/jwt';
import { PrismaClient } from '@prisma/client';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
      companyId: string;
    };
    user: {
      id: string;
      email: string;
      role: string;
      companyId: string;
      firstName: string;
      lastName: string;
      locations?: Array<{
        id: string;
        name: string;
      }>;
      company?: {
        id: string;
        name: string;
      };
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      role: string;
      companyId: string;
      firstName: string;
      lastName: string;
      locations?: Array<{
        id: string;
        name: string;
      }>;
      company?: {
        id: string;
        name: string;
      };
    };
  }

  interface FastifyInstance {
    prisma: PrismaClient;
    bcrypt: {
      hash: (password: string, saltRounds?: number) => Promise<string>;
      compare: (password: string, hash: string) => Promise<boolean>;
    };
  }
} 