'use client';
import React, { PropsWithChildren } from 'react';
import { AppShell, Burger, Skeleton } from '@mantine/core';
import Avatar from './Avatar';
import { useDisclosure } from '@mantine/hooks';
import { useSession } from 'next-auth/react';

export default function Sidebar({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      <AppShell
        h={'100%'}
        header={{ height: 50 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <div className="w-full h-full px-4 grid grid-cols-2 items-center">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Avatar
              alt="profile picture"
              className="justify-self-end col-start-2"
              src={session?.user?.image}
            >
              DM
            </Avatar>
          </div>
        </AppShell.Header>
        <AppShell.Navbar p="md" w={{ base: 250, sm: 300 }}>
          Navbar
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>
        <AppShell.Main className="h-full">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
