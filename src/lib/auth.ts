import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { addUserToDb } from '@/lib/dbQueries';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      if (!email || !name) return false;
      await addUserToDb(email, name, image);
      return true;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
