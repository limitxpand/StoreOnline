import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const devPassword = await bcrypt.hash('dev123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: 'dev@test.com' },
    update: {},
    create: {
      email: 'dev@test.com',
      name: 'Pro Developer',
      password: devPassword,
      role: 'developer',
    },
  });

  // Create Categories
  const categoriesData = [
    { name: 'Expert Advisors', slug: 'mt4-expert-advisors', platform: 'MT4' },
    { name: 'Indicators', slug: 'mt4-indicators', platform: 'MT4' },
    { name: 'Utilities', slug: 'mt4-utilities', platform: 'MT4' },
    { name: 'Expert Advisors', slug: 'mt5-expert-advisors', platform: 'MT5' },
    { name: 'Indicators', slug: 'mt5-indicators', platform: 'MT5' },
    { name: 'Utilities', slug: 'mt5-utilities', platform: 'MT5' },
    { name: 'Trading Bots', slug: 'android-trading-bots', platform: 'Android' },
    { name: 'Signals App', slug: 'android-signals-app', platform: 'Android' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Fetch created categories to link products
  const mt4EaCat = await prisma.category.findUnique({ where: { slug: 'mt4-expert-advisors' } });
  const mt5IndCat = await prisma.category.findUnique({ where: { slug: 'mt5-indicators' } });
  const androidBotCat = await prisma.category.findUnique({ where: { slug: 'android-trading-bots' } });

  // Create mock products
  if (mt4EaCat && mt5IndCat && androidBotCat) {
    const productsData = [
      {
        slug: 'gold-scalper-pro',
        title: 'Gold Scalper Pro EA',
        description: 'The ultimate automated trading system designed for XAUUSD (Gold). Built with advanced price action algorithms and strict risk management.',
        price: 129.00,
        status: 'published',
        platform: 'MT4',
        developerId: developer.id,
        categoryId: mt4EaCat.id,
      },
      {
        slug: 'quantum-indicator',
        title: 'Quantum Trend Indicator',
        description: 'Advanced trend prediction indicator using quantum math models. Never miss a reversal again.',
        price: 89.00,
        status: 'published',
        platform: 'MT5',
        developerId: developer.id,
        categoryId: mt5IndCat.id,
      },
      {
        slug: 'mobile-trader-pro',
        title: 'Mobile Trader Pro APK',
        description: 'Execute trades directly from Android with advanced risk management tools and built-in VPS connection.',
        price: 49.00,
        status: 'published',
        platform: 'Android',
        developerId: developer.id,
        categoryId: androidBotCat.id,
      }
    ];

    for (const prod of productsData) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
      });
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
