import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Załaduj zmienne środowiskowe z database.env
dotenv.config({ path: path.join(__dirname, '../database.env') });

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('🔍 Sprawdzanie użytkowników w bazie danych...\n');
    
    // Sprawdź połączenie
    await prisma.$connect();
    console.log('✅ Połączenie z bazą danych aktywne\n');
    
    // Sprawdź istniejących użytkowników
    const existingUsers = await prisma.user.findMany({
      include: {
        company: true
      }
    });
    
    console.log(`📊 Znaleziono ${existingUsers.length} użytkowników w bazie:\n`);
    
    if (existingUsers.length > 0) {
      existingUsers.forEach((user, index) => {
        console.log(`${index + 1}. 👤 ${user.firstName} ${user.lastName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Username: ${user.username}`);
        console.log(`   🛡️  Rola: ${user.role}`);
        console.log(`   🏢 Firma: ${user.company.name}`);
        console.log(`   ✅ Aktywny: ${user.isActive}`);
        console.log('');
      });
      
      console.log('ℹ️  Użytkownicy już istnieją. Użyj jednego z powyższych do logowania.\n');
      return;
    }
    
    console.log('🔧 Brak użytkowników. Tworzę użytkownika testowego...\n');
    
    // Hash hasła
    const passwordHash = await bcrypt.hash('password123', 12);
    
    // Utwórz firmę i użytkownika w transakcji
    const result = await prisma.$transaction(async (prisma) => {
      // Utwórz firmę
      const company = await prisma.company.create({
        data: {
          name: 'Demo Company',
          description: 'Firma demonstracyjna LiteCMMS',
          language: 'pl',
          timezone: 'Europe/Warsaw'
        }
      });
      
      console.log(`✅ Utworzono firmę: ${company.name}`);
      
      // Utwórz użytkownika
      const user = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          username: 'admin',
          firstName: 'Administrator',
          lastName: 'Systemu',
          passwordHash,
          role: 'ADMINISTRATOR',
          companyId: company.id,
          language: 'pl',
          timezone: 'Europe/Warsaw',
          isActive: true
        }
      });
      
      console.log(`✅ Utworzono użytkownika: ${user.firstName} ${user.lastName}`);
      
      // Utwórz domyślną lokalizację
      const location = await prisma.location.create({
        data: {
          name: 'Lokalizacja główna',
          description: 'Domyślna lokalizacja firmy',
          companyId: company.id,
          isActive: true
        }
      });
      
      console.log(`✅ Utworzono lokalizację: ${location.name}`);
      
      // Przypisz użytkownika do lokalizacji
      await prisma.userLocation.create({
        data: {
          userId: user.id,
          locationId: location.id
        }
      });
      
      console.log(`✅ Przypisano użytkownika do lokalizacji`);
      
      return { user, company, location };
    });
    
    console.log('\n🎉 Użytkownik testowy został utworzony pomyślnie!\n');
    console.log('📋 Dane do logowania:');
    console.log(`   📧 Email: admin@example.com`);
    console.log(`   🔐 Hasło: password123`);
    console.log(`   👤 Username: admin`);
    console.log(`   🛡️  Rola: ADMINISTRATOR\n`);
    
  } catch (error) {
    console.error('❌ Błąd podczas tworzenia użytkownika testowego:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 