import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (allowedRoles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeLocation: (locationId: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    logAudit: (request: FastifyRequest, auditData: any) => Promise<void>;
    createAuditDiff: (oldData: any, newData: any) => any;
  }

  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      username?: string;
      firstName: string;
      lastName: string;
      role: string;
      companyId: string;
      avatar?: string;
      language?: string;
      timezone?: string;
      twoFactorEnabled?: boolean;
      company: any;
      locations: any[];
    };
  }
} 