'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from './auth';
import { addUsernameDb } from './dbQueries';

const regex = /^[a-zA-Z0-9_]+$/;

const schema = z.object({
  username: z
    .string({ message: 'Must be a string.' })
    .trim()
    .min(4, 'Username must be atleast 4 characters long!')
    .max(25, 'Username must be at most 25 characters long!')
    .regex(regex, 'Username must not contain any special characters.'),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addUsername = async (prevState: any, formData: FormData) => {
  'use server';
  const session = await auth();
  if (!session?.user.email) throw new Error('Email not found');
  const validateFields = schema.safeParse({
    username: formData.get('username'),
  });
  console.log(validateFields.error);
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
