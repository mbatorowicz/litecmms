import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Singleton Prisma Client - bezpieczne podejście
let prisma: PrismaClient;

function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getPrismaClient();
  }

  // Bezpieczne hashowanie hasła
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Weryfikacja hasła
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generowanie tokenów JWT
  generateTokens(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId
    };

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

    // Naprawiony JWT access token z jawną konfiguracją
    const accessToken = jwt.sign(
      payload,
      jwtSecret,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
      } as jwt.SignOptions
    );

    // Naprawiony JWT refresh token z jawną konfiguracją
    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      refreshSecret,
      { 
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
      } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }

  // Weryfikacja tokena JWT
  async verifyToken(token: string): Promise<any> {
    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Znajdź użytkownika po email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
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
  }

  // Znajdź użytkownika po ID  
  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        locations: {
          include: {
            location: true
          }
        }
      }
    });
  }

  // Sprawdź czy użytkownik istnieje
  async userExists(email: string, username: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
  }

  // Utwórz nowego użytkownika z firmą
  async createUserWithCompany(userData: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    companyName: string;
    phone?: string;
  }) {
    const { email, username, firstName, lastName, password, companyName, phone } = userData;
    
    const passwordHash = await this.hashPassword(password);

    return this.prisma.$transaction(async (prisma) => {
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
          role: 'ADMINISTRATOR',
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
  }

  // Zapisz refresh token
  async saveRefreshToken(token: string, userId: string) {
    return this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dni
      }
    });
  }

  // Aktualizuj ostatnie logowanie
  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    });
  }

  // Usuń wszystkie refresh tokeny użytkownika
  async deleteRefreshTokens(userId: string) {
    return this.prisma.refreshToken.deleteMany({
      where: { userId }
    });
  }

  // Wyłączenie Prisma przy zamykaniu aplikacji
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Eksport singletona
export const authService = new AuthService(); 