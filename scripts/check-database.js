const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './apps/api/database.env' });

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Sprawdzanie użytkowników w bazie danych...\n');
    
    // Sprawdź połączenie
    await prisma.$connect();
    console.log('✅ Połączenie z bazą danych aktywne\n');
    
    // Pobierz wszystkich użytkowników
    const users = await prisma.user.findMany({
      include: {
        company: true,
        locations: {
          include: {
            location: true
          }
        }
      }
    });
    
    console.log(`📊 Znaleziono ${users.length} użytkowników:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. 👤 ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Username: ${user.username}`);
      console.log(`   🛡️  Rola: ${user.role}`);
      console.log(`   🏢 Firma: ${user.company.name}`);
      console.log(`   ✅ Aktywny: ${user.isActive}`);
      console.log(`   📅 Utworzony: ${user.createdAt.toLocaleDateString('pl-PL')}`);
      console.log(`   🔐 Hash hasła: ${user.passwordHash.substring(0, 20)}...`);
      console.log('');
    });
    
    // Sprawdź firmy
    const companies = await prisma.company.findMany();
    console.log(`🏢 Znaleziono ${companies.length} firm:\n`);
    
    companies.forEach((company, index) => {
      console.log(`${index + 1}. ${company.name}`);
      console.log(`   ID: ${company.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Błąd:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase(); 