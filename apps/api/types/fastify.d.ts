import { PrismaClient } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

interface AuditData {
  entity: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  oldValues?: any;
  newValues?: any;
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
    createAuditDiff: (oldData: any, newData: any) => { oldValues: any; newValues: any };
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