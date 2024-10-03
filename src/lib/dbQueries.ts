'use server';
import prisma from '@/app/api/db';
import { initialMessages } from './types';
// import { getServerSession } from 'next-auth';

export async function addUserToDb(
  email: string,
  name: string,
  picture: string | null | undefined
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return true;
    } else {
      await prisma.user.create({
        data: {
          name,
          email,
          picture,
        },
      });
    }
  } catch (err) {
    if (err) console.error(err);
    return false;
  }
}

export async function getUsername(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { username: true },
    });
    if (!user) throw new Error('Cannot find user');
    return user;
  } catch (error) {
    if (error) console.error(error);
  }
}

export async function addUsernameDb(email: string, username: string) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
    });
    if (existingUser) throw new Error('Username already exists');
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && !user.username) {
      const result = await prisma.user.update({
        where: { email },
        data: { username },
      });
      if (!result) throw new Error('Error adding username');
      return 'Success';
    } else {
      return 'User already has a username';
    }
  } catch (error) {
    if (error) console.error(error);
    return 'Username is taken';
  }
}

export async function addMessage(roomId: number, message: initialMessages) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: message.author.name as string },
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
        author: { select: { name: true, username: true, picture: true } },
        content: true,
      },
    });
    if (!messages) throw new Error('Cannot find messages');
    return messages;
  } catch (error) {
    if (error) console.error(error);
  }
}
