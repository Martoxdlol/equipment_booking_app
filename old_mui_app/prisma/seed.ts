/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // const tomas = await prisma.user.upsert({
  //   where: { email: 'tcichero@henryford.edu.ar' },
  //   update: {
  //     adminLevel: 1
  //   },
  //   create: {
  //     email: 'tcichero@henryford.edu.ar',
  //     name: 'Tomás',
  //   },
  // })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
