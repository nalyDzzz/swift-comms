'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Menu,
  useMantineColorScheme,
  Modal,
  Button,
  Popover,
  TextInput,
  NavLink,
} from '@mantine/core';
import Avatar from './Avatar';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { addChatroom } from '@/lib/formval';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Chatroom =
  | {
      id: number;
      name: string;
    }[]
  | undefined;

type AppLayoutProps = PropsWithChildren & {
  chatrooms: Chatroom;
};

export default function AppLayout({ children, chatrooms }: AppLayoutProps) {
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
            <AvatarDropdown session={session} />
          </div>
        </AppShell.Header>
        <AppShell.Navbar p="md" w={{ base: 250, sm: 300 }}>
          <NavContent chatrooms={chatrooms} />
        </AppShell.Navbar>
        <AppShell.Main className="h-full">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}

const AvatarDropdown = ({ session }: { session: Session | null }) => {
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Menu>
        <Menu.Target>
          <a className="justify-self-end col-start-2 cursor-pointer">
            <Avatar alt="profile picture" src={session?.user?.image}>
              DM
            </Avatar>
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

const NavContent = ({ chatrooms }: { chatrooms: Chatroom }) => {
  const path = usePathname();

  const activeCheck = (e: { id: number; name: string }) => {
    if ((path === '/chat' && e.name === 'Global') || path === `/chat/${e.id}`) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <CreateRoomButton />
      {chatrooms?.map((e) => (
        <Link href={e.id === 1 ? '/chat' : `/chat/${e.id}`} key={e.id}>
          <NavLink
            component="div"
            label={e.name}
            active={activeCheck(e)}
            autoContrast
          />
        </Link>
      ))}
    </>
  );
};

const CreateRoomButton = () => {
  const initialState = { errors: [] };
  const [opened, setOpened] = useState(false);
  const [state, formAction] = useFormState(addChatroom, initialState);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (state?.errors.length === 0 || !state?.errors) {
      setOpened(false);
    }
  }, [state?.errors, formAction]);

  return (
    <Popover opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Button variant="outline" onClick={() => setOpened(!opened)}>
          Create Chat Room
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <form
          action={async (formData) => {
            await formAction(formData);
            setValue('');
          }}
        >
          <TextInput
            label="Pick a name"
            placeholder="My Chatroom"
            error={state?.errors[0]?.message}
            name="chatroom"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </form>
      </Popover.Dropdown>
    </Popover>
  );
};
