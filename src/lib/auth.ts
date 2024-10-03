import NextAuth, { DefaultSession } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { addUserToDb, getUsername } from '@/lib/dbQueries';
import type { Provider } from 'next-auth/providers';

declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
    } & DefaultSession['user'];
  }
}

const providers: Provider[] = [GitHub, Google];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: providers,
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
