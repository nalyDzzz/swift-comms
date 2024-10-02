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

export async function addMessage(
  roomId: number,
  message: { message: string; author: string; date: Date }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: message.author },
      select: { id: true },
    });
    if (!user) throw new Error('Cannot find user');
    const result = await prisma.message.create({
      data: {
        date: message.date,
        authorId: user.id,
        content: message.message,
        chatroomId: roomId,
      },
    });
    if (!result) throw new Error('Cannot add message to DB');
  } catch (error) {
    if (error) console.error(error);
  }
}
