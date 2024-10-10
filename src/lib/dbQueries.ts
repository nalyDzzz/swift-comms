'use server';
import prisma from '@/app/api/db';
import { SendMessage } from './types';
import { revalidatePath } from 'next/cache';

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
          chatrooms: {
            connect: { id: '1' },
          },
        },
      });
    }
  } catch (err) {
    if (err) console.error(err);
    return false;
  }
}

export async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { username: true, id: true },
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

export async function addChatroomDb(email: string, chatroom: string) {
  try {
    const result = await prisma.chatroom.create({
      data: {
        name: chatroom,
        User: { connect: { email } },
        Owner: { connect: { email } },
      },
      include: { User: true },
    });
    if (!result) throw new Error('Error creating chatroom');
    revalidatePath('/chat');
    return 'Success';
  } catch (error) {
    if (error) console.error(error);
    return 'Error';
  }
}

export async function editChatroomName(id: string, name: string) {
  try {
    const result = await prisma.chatroom.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    if (!result) throw new Error('Error editing chatroom');
    revalidatePath('/chat');
    return 'Success';
  } catch (error) {
    if (error) console.error(error);
    return 'Error';
  }
}

export async function deleteChatroom(id: string) {
  try {
    const result = await prisma.chatroom.delete({
      where: { id },
      include: { messages: true },
    });
    if (!result) throw new Error('Error deleting chatroom');
    revalidatePath('/chat');
  } catch (error) {
    if (error) console.error(error);
  }
}

export async function getChatrooms(email: string) {
  try {
    const chatrooms = await prisma.chatroom.findMany({
      where: { User: { some: { email } } },
      orderBy: { id: 'asc' },
    });
    return chatrooms;
  } catch (error) {
    if (error) console.error(error);
    return [];
  }
}

export async function addMessage(roomId: string, message: SendMessage) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: message.author.username as string },
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

export async function getMessages(
  roomId: string,
  limit: number,
  cursor?: string
) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatroomId: roomId },
      orderBy: { date: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        date: true,
        id: true,
        author: { select: { name: true, username: true, picture: true } },
        content: true,
      },
    });
    if (!messages) throw new Error('Cannot find messages');
    return messages.reverse();
  } catch (error) {
    if (error) console.error(error);
    return [];
  }
}

export async function addInvite(from: string, to: string, chatroom: string) {
  try {
    const exists = await prisma.invite.findFirst({
      where: { fromId: from, toId: to, ChatroomId: chatroom },
    });
    if (exists) throw new Error('Invite already exists');
    const result = await prisma.invite.create({
      data: {
        fromId: from,
        toId: to,
        ChatroomId: chatroom,
      },
      select: {
        id: true,
        fromId: true,
        toId: true,
        ChatroomId: true,
        from: { select: { username: true } },
        Chatroom: { select: { name: true } },
      },
    });
    if (!result) throw new Error('Error sending invite');
    return result;
  } catch (error) {
    if (error) console.error(error);
  }
}

export async function getInvites(userId: string) {
  try {
    const result = await prisma.invite.findMany({
      where: { toId: userId },
      select: {
        id: true,
        fromId: true,
        toId: true,
        ChatroomId: true,
        from: { select: { username: true } },
        Chatroom: { select: { name: true, id: true } },
      },
    });
    if (!result) throw new Error('Error finding invites');
    return result;
  } catch (error) {
    if (error) console.error(error);
    return [];
  }
}

export async function addUserToChatroom(chatroomId: string, userId: string) {
  try {
    const result = await prisma.chatroom.update({
      where: { id: chatroomId },
      data: {
        User: { connect: { id: userId } },
      },
    });
    if (!result) throw new Error('Error adding user');
    revalidatePath('/chat');
    return 'Success';
  } catch (error) {
    if (error) console.error(error);
    return 'Failed';
  }
}

export async function deleteInvite(id: string) {
  try {
    console.log(`ID: ${id}`);
    const result = await prisma.invite.delete({ where: { id: id } });
    if (!result) throw new Error('Error deleting invite');
    return 'Success';
  } catch (error) {
    if (error) console.error(error);
    return 'Failed';
  }
}

export async function getAllUsers() {
  try {
    const result = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        picture: true,
        chatrooms: { select: { id: true } },
        Invites: {
          select: {
            from: { select: { username: true } },
            to: { select: { username: true } },
            Chatroom: { select: { name: true, id: true } },
          },
        },
      },
    });
    if (!result) throw new Error('Error sending invite');
    return result;
  } catch (err) {
    if (err) console.error(err);
    return [];
  }
}

export async function leaveChatroom(chatroomId: string, userId: string) {
  try {
    const result = await prisma.chatroom.update({
      where: { id: chatroomId },
      data: { User: { disconnect: { id: userId } } },
    });
    if (!result) throw new Error('Error leaving chatroom');
    return 'Success';
  } catch (error) {
    if (error) console.error(error);
    return 'Failed';
  }
}
