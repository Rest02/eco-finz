import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Checking DB Projections ---');
  const projections = await prisma.projection.findMany({
    include: {
      account: true,
      category: true,
    }
  });
  console.log('Projections in DB:', JSON.stringify(projections, null, 2));

  console.log('\n--- Checking DB Accounts ---');
  const accounts = await prisma.account.findMany();
  console.log('Accounts in DB:', JSON.stringify(accounts, null, 2));

  console.log('\n--- Checking DB Transactions ---');
  const transactions = await prisma.transaction.findMany();
  console.log('Transactions in DB:', JSON.stringify(transactions, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
