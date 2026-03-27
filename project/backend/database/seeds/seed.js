/**
 * Database Seed Script
 * Person 1: Backend Developer
 * Run with: npm run seed
 */

const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../../src/utils/auth.utils');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.educationalProgress.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.child.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create demo parent account
  const hashedPassword = await hashPassword('demo123');

  const parent = await prisma.user.create({
    data: {
      email: 'demo@parent.com',
      password: hashedPassword,
      name: 'Maria Papadopoulos'
    }
  });

  console.log('✅ Created demo parent:', parent.email);

  // Create demo children
  const sophia = await prisma.child.create({
    data: {
      name: 'Sophia',
      age: 12,
      balance: 50.00,
      userId: parent.id,
      pin: '1234'
    }
  });

  const nikos = await prisma.child.create({
    data: {
      name: 'Nikos',
      age: 15,
      balance: 75.50,
      userId: parent.id,
      pin: '5678'
    }
  });

  console.log('✅ Created demo children:', sophia.name, nikos.name);

  // Create demo transactions for Sophia
  await prisma.transaction.createMany({
    data: [
      {
        childId: sophia.id,
        amount: -5.50,
        description: 'Ice cream with friends',
        category: 'Food',
        status: 'approved'
      },
      {
        childId: sophia.id,
        amount: -12.00,
        description: 'Book purchase',
        category: 'Education',
        status: 'approved'
      },
      {
        childId: sophia.id,
        amount: -8.00,
        description: 'Movie ticket',
        category: 'Entertainment',
        status: 'pending'
      },
      {
        childId: sophia.id,
        amount: 20.00,
        description: 'Weekly allowance',
        category: 'Allowance',
        status: 'approved'
      }
    ]
  });

  // Create demo transactions for Nikos
  await prisma.transaction.createMany({
    data: [
      {
        childId: nikos.id,
        amount: -15.00,
        description: 'Gaming subscription',
        category: 'Entertainment',
        status: 'approved'
      },
      {
        childId: nikos.id,
        amount: -25.00,
        description: 'New headphones',
        category: 'Electronics',
        status: 'pending'
      },
      {
        childId: nikos.id,
        amount: 30.00,
        description: 'Weekly allowance',
        category: 'Allowance',
        status: 'approved'
      }
    ]
  });

  console.log('✅ Created demo transactions');

  // Create demo budgets
  await prisma.budget.createMany({
    data: [
      {
        childId: sophia.id,
        category: 'Weekly Spending',
        limitAmount: 30.00,
        currentSpent: 17.50,
        period: 'weekly'
      },
      {
        childId: sophia.id,
        category: 'Savings Goal',
        limitAmount: 100.00,
        currentSpent: 50.00,
        period: 'monthly'
      },
      {
        childId: nikos.id,
        category: 'Weekly Spending',
        limitAmount: 50.00,
        currentSpent: 40.00,
        period: 'weekly'
      }
    ]
  });

  console.log('✅ Created demo budgets');

  // Create demo educational progress
  await prisma.educationalProgress.createMany({
    data: [
      {
        childId: sophia.id,
        lessonId: 1,
        lessonTitle: 'What is Money?',
        completed: true,
        score: 95,
        completedAt: new Date('2026-03-20')
      },
      {
        childId: sophia.id,
        lessonId: 2,
        lessonTitle: 'Saving vs Spending',
        completed: true,
        score: 88,
        completedAt: new Date('2026-03-22')
      },
      {
        childId: sophia.id,
        lessonId: 3,
        lessonTitle: 'Setting Financial Goals',
        completed: false,
        score: null,
        completedAt: null
      },
      {
        childId: nikos.id,
        lessonId: 1,
        lessonTitle: 'What is Money?',
        completed: true,
        score: 100,
        completedAt: new Date('2026-03-19')
      }
    ]
  });

  console.log('✅ Created demo educational progress');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Email: demo@parent.com');
  console.log('   Password: demo123');
  console.log('\n👶 Children:');
  console.log('   - Sophia (age 12, balance: €50.00)');
  console.log('   - Nikos (age 15, balance: €75.50)');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
