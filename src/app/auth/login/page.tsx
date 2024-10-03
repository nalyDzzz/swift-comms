'use client';
import { signIn } from 'next-auth/react';
import React from 'react';

export default function Login() {
  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={() => signIn('github', { callbackUrl: '/chat' })}>
        Sign in with Github
      </button>
    </div>
  );
}
