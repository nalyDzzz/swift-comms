'use client';
import React, { PropsWithChildren } from 'react';
import {
  AppShell,
  Burger,
  Menu,
  useMantineColorScheme,
  Modal,
  Button,
  NavLink,
  Indicator,
} from '@mantine/core';
import Avatar from './Avatar';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSocket } from '@/components/context/SocketProvider';
import { Chatroom } from '@/lib/types';
import ChangeNameModal from '@/components/nav/ChangeNameModal';
import Invites from '@/components/nav/Invites';
import CreateRoomButton from '@/components/nav/CreateRoomButton';
import InviteUserModal from '@/components/nav/InviteUserModal';
import { useData } from './context/DataProvider';

export default function AppLayout({ children }: PropsWithChildren) {
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
            <div className="justify-self-end col-start-2 flex flex-row items-center gap-2">
              <Invites />
              <AvatarDropdown session={session} />
            </div>
          </div>
        </AppShell.Header>
        <AppShell.Navbar p="md" w={{ base: 250, sm: 300 }}>
          <NavContent />
        </AppShell.Navbar>
        <AppShell.Main className="h-full">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}

const AvatarDropdown = ({ session }: { session: Session | null }) => {
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  const { socket } = useSocket();
  return (
    <>
      <Menu>
        <Menu.Target>
          <a className="cursor-pointer">
            <Indicator
              position="bottom-end"
              withBorder
              size={15}
              offset={5}
              color={socket ? 'green' : 'red'}
            >
              <Avatar alt="profile picture" src={session?.user?.image}>
                DM
              </Avatar>
            </Indicator>
          </a>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Options</Menu.Label>
          <Menu.Item onClick={() => toggleColorScheme()}>
            Theme Toggle
          </Menu.Item>
          <Menu.Item component="a" onClick={open}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={opened}
        onClose={close}
        classNames={{ body: 'flex flex-col justify-center items-center' }}
        centered
        withCloseButton={false}
        radius="lg"
      >
        <p>Are you sure?</p>
        <div className="flex flex-row gap-2 pt-5">
          <Button color="cyan.8" onClick={() => signOut()}>
            Yes
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

const NavContent = () => {
  const path = usePathname();
  const { chatrooms } = useData();
  const activeCheck = (e: { id: string; name: string }) => {
    if ((path === '/chat' && e.name === 'Global') || path === `/chat/${e.id}`) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <CreateRoomButton />
      {chatrooms.map((e) => (
        <Link
          href={e.id === '1' ? '/chat' : `/chat/${e.id}`}
          key={e.id}
          className="flex"
        >
          <NavLink
            component="div"
            label={e.name}
            active={activeCheck(e)}
            autoContrast
            className="group"
            rightSection={<NavLinkRightSide chatroom={e} />}
          />
        </Link>
      ))}
    </>
  );
};

const NavLinkRightSide = ({ chatroom }: { chatroom: Chatroom }) => {
  // const sendInvite = async () => {
  //   if (socket) {
  //     socket.emit('invite', {
  //       chatroom: chatroom.id,
  //       fromId: 'cm20yuxhq0000plsznm95tnuy',
  //       fromUser: 'nalyD',
  //       toId: 'cm212t2940000p3y144gx0zzw',
  //       toUser: 'TestUser',
  //     });
  //   }
  // };

  return (
    <div
      className={cn(
        { 'group-hover:visible': chatroom.id !== '1' },
        'group invisible z-50'
      )}
    >
      <InviteUserModal chatroom={chatroom} />
      <ChangeNameModal chatroom={chatroom} />
    </div>
  );
};
