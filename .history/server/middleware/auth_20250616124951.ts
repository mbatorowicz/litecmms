import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

interface AuthOptions {
  requireAuth?: boolean;
  roles?: string[];
}

export const authMiddleware: FastifyPluginAsync = async function (fastify) {
  // Decorator do weryfikacji tokena
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new Error('No token provided');
      }

      // Weryfikacja JWT
      const decoded = await request.jwtVerify() as { id: string; email: string; role: string; companyId: string };
      
      // Pobranie pełnych danych użytkownika z bazy
      const user = await fastify.prisma.user.findUnique({
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

      // Dodanie danych użytkownika do request
      request.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        firstName: user.firstName,
        lastName: user.lastName,
        locations: user.locations.map(ul => ul.location),
        company: user.company
      };

      // Aktualizacja ostatniego logowania
      await fastify.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

    } catch (err) {
      reply.code(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
  });

  // Decorator do sprawdzania ról
  fastify.decorate('authorize', function (allowedRoles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      if (!request.user) {
        reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
        return;
      }

      if (!allowedRoles.includes(request.user.role)) {
        reply.code(403).send({
          error: 'Forbidden',
          message: 'Insufficient permissions'
        });
        return;
      }
    };
  });

  // Decorator do sprawdzania dostępu do lokalizacji
  fastify.decorate('authorizeLocation', function (locationId: string) {
    return async function (request: FastifyRequest, reply: FastifyReply) {
      if (!request.user) {
        reply.code(401).send({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
        return;
      }

      // Administrator ma dostęp do wszystkich lokalizacji
      if (request.user.role === 'ADMINISTRATOR') {
        return;
      }

      // Sprawdzenie czy użytkownik ma dostęp do danej lokalizacji
      const hasAccess = request.user.locations?.some(location => location.id === locationId);
      
      if (!hasAccess) {
        reply.code(403).send({
          error: 'Forbidden',
          message: 'No access to this location'
        });
        return;
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
      await fastify.authenticate(request, reply);
    }
  });
};

// Typy są już zdefiniowane w server/types/fastify.d.ts

export default authMiddleware; 