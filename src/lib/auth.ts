import NextAuth, { DefaultSession } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { addUserToDb, getUsername } from '@/lib/dbQueries';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
    } & DefaultSession['user'];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      if (!email || !name) return false;
      await addUserToDb(email, name, image);
      return true;
    },
    async session({ session }) {
      const user = await getUsername(session.user.email);
      if (user && user.username) {
        session.user.username = user.username;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
