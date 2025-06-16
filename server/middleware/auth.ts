import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

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

export const authMiddleware: FastifyPluginAsync = async function (fastify) {
  // Decorator do weryfikacji tokena
  fastify.decorate('authenticate', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new Error('No token provided');
      }

      // Weryfikacja JWT z poprawnym typowaniem
      const decoded = await request.jwtVerify() as JWTPayload;
      
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

      // Dodanie danych użytkownika do request z poprawnymi typami
      request.user = {
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

  // Decorator do autoryzacji ról z poprawnym typowaniem
  fastify.decorate('authorize', (allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.user) {
          await fastify.authenticate(request, reply);
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
          await fastify.authenticate(request, reply);
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
      await fastify.authenticate(request, reply);
    }
  });
};

// Typy są już zdefiniowane w server/types/fastify.d.ts

export default authMiddleware; 