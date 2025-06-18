import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

interface AuthOptions {
  requireAuth?: boolean;
  roles?: string[];
}

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  companyId: string;
}

interface FastifyInstanceWithPrisma {
  prisma: PrismaClient;
}

export const authMiddleware: FastifyPluginAsync = async function (fastify) {
  // Explicit casting dla Prisma
  const fastifyWithPrisma = fastify as typeof fastify & FastifyInstanceWithPrisma;
  
  // Funkcja pomocnicza do weryfikacji użytkownika
  async function authenticateUser(request: FastifyRequest): Promise<any> {
    const token = request.cookies.token || 
                 request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    // Weryfikacja JWT z poprawnym typowaniem
    const decoded = await request.jwtVerify() as JWTPayload;
    
    // Pobranie pełnych danych użytkownika z bazy
    const user = await fastifyWithPrisma.prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        company: true,
        locations: {
          include: {
            location: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Aktualizacja ostatniego logowania
    await fastifyWithPrisma.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
      locations: user.locations.map((ul: any) => ul.location),
      company: user.company
    };
  }

  // Decorator do weryfikacji tokena
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await authenticateUser(request);
      request.user = user;
    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
  });

  // Decorator do autoryzacji ról z poprawnym typowaniem
  fastify.decorate('authorize', (allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user) {
          const user = await authenticateUser(request);
          request.user = user;
        }

        const user = request.user as any;
        if (!user || !allowedRoles.includes(user.role)) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You do not have permission to access this resource'
          });
          return;
        }
      } catch (err) {
        reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }
    };
  });

  // Decorator do autoryzacji lokalizacji z poprawnym typowaniem
  fastify.decorate('authorizeLocation', (locationId: string) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user) {
          const user = await authenticateUser(request);
          request.user = user;
        }

        const user = request.user as any;
        if (!user) {
          reply.code(401).send({ error: 'Authentication required' });
          return;
        }

        // Administrator ma dostęp do wszystkich lokalizacji
        if (user.role === 'ADMINISTRATOR') {
          return;
        }

        // Sprawdź czy użytkownik ma dostęp do tej lokalizacji
        const hasAccess = user.locations?.some((location: any) => location.id === locationId);

        if (!hasAccess) {
          reply.code(403).send({
            error: 'Forbidden',
            message: 'You do not have access to this location'
          });
          return;
        }
      } catch (err) {
        reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }
    };
  });

  // Hook do automatycznej autoryzacji dla określonych route'ów
  fastify.addHook('preHandler', async (request, reply) => {
    // Lista route'ów publicznych
    const publicRoutes = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/health'
    ];

    // Sprawdzenie czy route jest publiczny
    if (publicRoutes.includes(request.url)) {
      return;
    }

    // Automatyczna autoryzacja dla chronionej API
    if (request.url.startsWith('/api/')) {
      try {
        const user = await authenticateUser(request);
        request.user = user;
      } catch (err) {
        reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }
    }
  });
};

// Typy są już zdefiniowane w server/types/fastify.d.ts

export default authMiddleware; 