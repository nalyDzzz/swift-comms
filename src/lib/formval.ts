'use server';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from './auth';
import { addChatroomDb, addUsernameDb, editChatroomName } from './dbQueries';

const regex = /^[a-zA-Z0-9_]+$/;

const usernameSchema = z.object({
  username: z
    .string({ message: 'Must be a string.' })
    .trim()
    .min(4, 'Username must be atleast 4 characters long!')
    .max(25, 'Username must be at most 25 characters long!')
    .regex(regex, 'Username must not contain any special characters.'),
});

export const addUsername = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user.email) throw new Error('Email not found');
  const validateFields = usernameSchema.safeParse({
    username: formData.get('username'),
  });
  if (!validateFields.success) {
    return {
      errors: validateFields.error.issues,
    };
  } else {
    const username = formData.get('username') as string;
    const result = await addUsernameDb(session.user.email, username);
    switch (result) {
      case 'User already has a username':
        return { errors: [{ message: 'User already has a username' }] };
      case 'Username is taken':
        return { errors: [{ message: 'Username is taken' }] };
      case 'Success':
        return revalidatePath('/chat');
    }
  }
};

const chatroomSchema = z.object({
  chatroom: z
    .string({ message: 'Must be a string.' })
    .trim()
    .min(4, 'Chatroom must be atleast 4 characters long!')
    .max(25, 'Chatroom must be at most 25 characters long!')
    .regex(regex, 'Chatroom must not contain any special characters.'),
});

export const addChatroom = async (prevState: any, formData: FormData) => {
  const session = await auth();
  if (!session?.user.email) throw new Error('Not authorized');
  const validateFields = chatroomSchema.safeParse({
    chatroom: formData.get('chatroom'),
  });
  if (!validateFields.success) {
    return {
      errors: validateFields.error.issues,
    };
  } else {
    const chatroom = formData.get('chatroom') as string;
    const result = await addChatroomDb(session.user.email, chatroom);
    if (result === 'Error')
      return { errors: [{ message: 'An error occured!' }] };
    if (result === 'Success') revalidatePath('/chat');
  }
};

export const editChatroom = async (prevState: any, formData: FormData) => {
  console.log('called');
  const session = await auth();
  if (!session?.user.email) throw new Error('Not authorized');
  const validateFields = chatroomSchema.safeParse({
    chatroom: formData.get('chatroom'),
  });
  if (!validateFields.success) {
    return {
      errors: validateFields.error.issues,
    };
  } else {
    const chatroom = formData.get('chatroom') as string;
    const id = formData.get('id') as string;
    const result = await editChatroomName(id, chatroom);
    if (result === 'Error')
      return { errors: [{ message: 'An error occured!' }] };
    if (result === 'Success') revalidatePath('/chat');
  }
};
