import React from 'react';
import { providerMap, signIn } from '@/lib/auth';
import { cn } from '@/lib/utils';
import ColorIcon from '@/components/ColorIcon';

export default function Login() {
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-center text-4xl font-bold">Sign in</h1>
      <div className="flex justify-center items-center flex-col mt-5 gap-5">
        {Object.values(providerMap).map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              'use server';
              try {
                await signIn(provider.id, {
                  redirectTo: '/chat',
                });
              } catch (error) {
                throw error;
              }
            }}
          >
            <button
              type="submit"
              className={cn(
                'flex justify-center items-center p-2 gap-2 rounded-lg font-semibold',
                {
                  'bg-neutral-600 hover:bg-neutral-700 text-white':
                    provider.name === 'GitHub',
                },
                {
                  'bg-white hover:bg-white/90 text-dark-8':
                    provider.name === 'Google',
                }
              )}
            >
              <ColorIcon type={provider.name} />
              <span>Sign in with {provider.name}</span>
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
