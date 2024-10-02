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
  message: { content: string; author: { name: string }; date: Date }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: message.author.name },
      select: { id: true },
    });
    if (!user) throw new Error('Cannot find user');
    const result = await prisma.message.create({
      data: {
        date: message.date,
        authorId: user.id,
        content: message.content,
        chatroomId: roomId,
      },
    });
    if (!result) throw new Error('Cannot add message to DB');
  } catch (error) {
    if (error) console.error(error);
  }
}

export async function getMessages(roomId: number) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatroomId: roomId },
      select: {
        date: true,
        author: { select: { name: true, username: true } },
        content: true,
      },
    });
    if (!messages) throw new Error('Cannot find messages');
    return messages;
  } catch (error) {
    if (error) console.error(error);
  }
}
