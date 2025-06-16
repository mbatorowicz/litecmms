import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Schematy walidacji
const loginSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków')
});

const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
  username: z.string().min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki'),
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć co najmniej 2 znaki'),
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  companyName: z.string().min(2, 'Nazwa firmy musi mieć co najmniej 2 znaki'),
  phone: z.string().optional()
});

const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Nieprawidłowy format email')
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków')
});

const authRoutes: FastifyPluginAsync = async function (fastify, opts) {
  
  // Bezpośrednie użycie Prisma i bcrypt
  const prisma = new PrismaClient();
  
  // Funkcja do generowania tokenów JWT
  function generateTokens(user: any) {
    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    });

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }

  // POST /api/auth/login
  fastify.post('/login', {
    schema: {
      body: loginSchema
    }
  }, async (request, reply) => {
    const { email, password } = request.body as z.infer<typeof loginSchema>;

    try {
      // Znajdź użytkownika - BEZPOŚREDNIE użycie Prisma
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          company: true,
          locations: {
            include: {
              location: true
            }
          }
        }
      });

      if (!user) {
        reply.code(401).send({
          error: 'Nieprawidłowe dane logowania',
          message: 'Email lub hasło jest nieprawidłowe'
        });
        return;
      }

      // Sprawdź czy użytkownik jest aktywny
      if (!user.isActive) {
        reply.code(401).send({
          error: 'Konto nieaktywne',
          message: 'Twoje konto zostało dezaktywowane'
        });
        return;
      }

      // Sprawdź hasło - BEZPOŚREDNIE użycie bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        reply.code(401).send({
          error: 'Nieprawidłowe dane logowania',
          message: 'Email lub hasło jest nieprawidłowe'
        });
        return;
      }

      // Generuj tokeny
      const { accessToken, refreshToken } = generateTokens(user);

      // Zapisz refresh token w bazie
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dni
        }
      });

      // Ustaw cookie z tokenem
      reply.setCookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minut
      });

      // Aktualizuj ostatnie logowanie
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      reply.send({
        success: true,
        message: 'Logowanie pomyślne',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          language: user.language,
          company: user.company,
          locations: user.locations.map((ul: any) => ul.location)
        },
        accessToken,
        refreshToken
      });

    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Wystąpił błąd podczas logowania'
      });
    }
  });

  // POST /api/auth/register
  fastify.post('/register', {
    schema: {
      body: registerSchema
    }
  }, async (request, reply) => {
    const { email, username, firstName, lastName, password, companyName, phone } = 
      request.body as z.infer<typeof registerSchema>;

    try {
      // Sprawdź czy użytkownik już istnieje
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        reply.code(409).send({
          error: 'Użytkownik już istnieje',
          message: 'Email lub nazwa użytkownika już są zajęte'
        });
        return;
      }

      // Hash hasła - BEZPOŚREDNIE użycie bcrypt
      const passwordHash = await bcrypt.hash(password, 12);

      // Utwórz firmę i użytkownika w transakcji
      const result = await prisma.$transaction(async (prisma: any) => {
        // Utwórz firmę
        const company = await prisma.company.create({
          data: {
            name: companyName,
            language: 'pl',
            timezone: 'Europe/Warsaw'
          }
        });

        // Utwórz użytkownika jako Administrator
        const user = await prisma.user.create({
          data: {
            email,
            username,
            firstName,
            lastName,
            passwordHash,
            phone,
            role: 'ADMINISTRATOR', // Pierwszy użytkownik w firmie to admin
            companyId: company.id,
            language: 'pl',
            timezone: 'Europe/Warsaw'
          }
        });

        // Utwórz domyślną lokalizację
        const location = await prisma.location.create({
          data: {
            name: 'Lokalizacja główna',
            description: 'Domyślna lokalizacja',
            companyId: company.id
          }
        });

        // Przypisz użytkownika do lokalizacji
        await prisma.userLocation.create({
          data: {
            userId: user.id,
            locationId: location.id
          }
        });

        return { user, company, location };
      });

      reply.code(201).send({
        success: true,
        message: 'Konto zostało pomyślnie utworzone',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          role: result.user.role
        }
      });

    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Wystąpił błąd podczas rejestracji'
      });
    }
  });

  // POST /api/auth/logout
  fastify.post('/logout', async (request, reply) => {
    try {
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (token) {
        // Usuń wszystkie refresh tokeny użytkownika
        const decoded = jwt.decode(token) as any;
        if (decoded?.id) {
          await prisma.refreshToken.deleteMany({
            where: { userId: decoded.id }
          });
        }
      }

      // Usuń cookie
      reply.clearCookie('token');

      reply.send({
        success: true,
        message: 'Zostałeś pomyślnie wylogowany'
      });

    } catch (error) {
      reply.send({
        success: true,
        message: 'Zostałeś pomyślnie wylogowany'
      });
    }
  });

  // GET /api/auth/me - TYMCZASOWO WYŁĄCZONE do testów (wymaga middleware)
  // fastify.get('/me', async (request, reply) => {
  //   try {
  //     await fastify.authenticate(request, reply);
      
  //     const user = await fastify.prisma.user.findUnique({
  //       where: { id: request.user!.id },
  //       include: {
  //         company: true,
  //         locations: {
  //           include: {
  //             location: true
  //           }
  //         }
  //       }
  //     });

  //     if (!user) {
  //       reply.code(404).send({
  //         error: 'Użytkownik nie znaleziony'
  //       });
  //       return;
  //     }

  //     reply.send({
  //       user: {
  //         id: user.id,
  //         email: user.email,
  //         username: user.username,
  //         firstName: user.firstName,
  //         lastName: user.lastName,
  //         role: user.role,
  //         avatar: user.avatar,
  //         language: user.language,
  //         timezone: user.timezone,
  //         twoFactorEnabled: user.twoFactorEnabled,
  //         company: user.company,
  //         locations: user.locations.map((ul: any) => ul.location)
  //       }
  //     });

  //   } catch (error) {
  //     reply.code(401).send({
  //       error: 'Unauthorized'
  //     });
  //   }
  // });

  // TODO: Implementacja 2FA endpoints - wymagane dodatkowe zależności
  // Tymczasowo wyłączone do testów podstawowych funkcjonalności
};

export default authRoutes;