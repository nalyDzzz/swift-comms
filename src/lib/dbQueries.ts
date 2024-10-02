'use server';
import prisma from '@/app/api/db';
// import { getServerSession } from 'next-auth';

export async function addUserToDb(email: string, name: string) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return true;
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
        },
      });
    }
  } catch (err) {
    if (err) console.error(err);
    return false;
  }
}
