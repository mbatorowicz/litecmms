import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

interface AuditData {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

interface Company {
  id: string;
  name: string;
  settings?: Record<string, unknown>;
}

interface Location {
  id: string;
  name: string;
  companyId: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (allowedRoles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeLocation: (locationId: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    logAudit: (request: FastifyRequest, auditData: AuditData) => Promise<void>;
    createAuditDiff: (oldData: Record<string, unknown>, newData: Record<string, unknown>) => Record<string, unknown>;
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
      company: Company;
      locations: Location[];
    };
  }
} 