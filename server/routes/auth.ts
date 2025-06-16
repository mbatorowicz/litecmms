import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { authService } from '../services/authService';

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

  // POST /api/auth/login - BEZPIECZNE PODEJŚCIE
  fastify.post('/login', async (request, reply) => {
    try {
      // Walidacja przez Zod
      const validatedData = loginSchema.parse(request.body);
      const { email, password } = validatedData;

      // Znajdź użytkownika przez AuthService
      const user = await authService.findUserByEmail(email);

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

      // Weryfikuj hasło przez AuthService
      const isPasswordValid = await authService.verifyPassword(password, user.passwordHash);
      if (!isPasswordValid) {
        reply.code(401).send({
          error: 'Nieprawidłowe dane logowania',
          message: 'Email lub hasło jest nieprawidłowe'
        });
        return;
      }

      // Generuj tokeny przez AuthService
      const { accessToken, refreshToken } = authService.generateTokens(user);

      // Zapisz refresh token przez AuthService
      await authService.saveRefreshToken(refreshToken, user.id);

      // Ustaw cookie z tokenem
      reply.setCookie('token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minut
      });

      // Aktualizuj ostatnie logowanie przez AuthService
      await authService.updateLastLogin(user.id);

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
      // Obsługa błędów walidacji Zod
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          error: 'Błąd walidacji',
          message: error.errors[0].message,
          details: error.errors
        });
        return;
      }

      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Wystąpił błąd podczas logowania'
      });
    }
  });

  // POST /api/auth/register - BEZPIECZNE PODEJŚCIE
  fastify.post('/register', async (request, reply) => {
    try {
      // Walidacja przez Zod
      const validatedData = registerSchema.parse(request.body);
      const { email, username, firstName, lastName, password, companyName, phone } = validatedData;

      // Sprawdź czy użytkownik już istnieje przez AuthService
      const existingUser = await authService.userExists(email, username);

      if (existingUser) {
        reply.code(409).send({
          error: 'Użytkownik już istnieje',
          message: 'Email lub nazwa użytkownika już są zajęte'
        });
        return;
      }

      // Utwórz użytkownika z firmą przez AuthService
      const result = await authService.createUserWithCompany({
        email,
        username,
        firstName,
        lastName,
        password,
        companyName,
        phone
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
      // Obsługa błędów walidacji Zod
      if (error instanceof z.ZodError) {
        reply.code(400).send({
          error: 'Błąd walidacji',
          message: error.errors[0].message,
          details: error.errors
        });
        return;
      }

      fastify.log.error(error);
      reply.code(500).send({
        error: 'Błąd serwera',
        message: 'Wystąpił błąd podczas rejestracji'
      });
    }
  });

  // POST /api/auth/logout - BEZPIECZNE PODEJŚCIE
  fastify.post('/logout', async (request, reply) => {
    try {
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (token) {
        // Usuń wszystkie refresh tokeny użytkownika przez AuthService
        const decoded = jwt.decode(token) as any;
        if (decoded?.id) {
          await authService.deleteRefreshTokens(decoded.id);
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

  // GET /api/auth/me - endpoint do sprawdzania obecnej sesji
  fastify.get('/me', async (request, reply) => {
    try {
      const token = request.cookies.token || 
                   request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        reply.code(401).send({ error: 'Brak tokena autoryzacji' });
        return;
      }

      // Weryfikuj token przez AuthService
      const decoded = await authService.verifyToken(token);
      
      // Znajdź użytkownika przez AuthService
      const user = await authService.findUserById(decoded.id);

      if (!user || !user.isActive) {
        reply.code(401).send({ error: 'Nieprawidłowy użytkownik' });
        return;
      }

      reply.send({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.avatar,
          language: user.language,
          timezone: user.timezone,
          twoFactorEnabled: user.twoFactorEnabled,
          company: user.company,
          locations: user.locations.map((ul: any) => ul.location)
        }
      });

    } catch (error) {
      reply.code(401).send({
        error: 'Nieprawidłowy token',
        message: 'Token jest nieprawidłowy lub wygasł'
      });
    }
  });

  // TODO: Implementacja 2FA endpoints - wymagane dodatkowe zależności
  // Tymczasowo wyłączone do testów podstawowych funkcjonalności
};

export default authRoutes;