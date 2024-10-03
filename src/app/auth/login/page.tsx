'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Login() {
  const { status } = useSession();
  const router = useRouter();
  if (status === 'authenticated') router.push('/chat');
  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={() => signIn('github')}>Sign in with Github</button>
    </div>
  );
}
