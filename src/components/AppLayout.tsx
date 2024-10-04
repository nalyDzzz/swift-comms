'use client';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  AppShell,
  Burger,
  Skeleton,
  Menu,
  useMantineColorScheme,
  Modal,
  Button,
  Popover,
  TextInput,
} from '@mantine/core';
import Avatar from './Avatar';
import { useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { addChatroom } from '@/lib/formval';
import { useFormState } from 'react-dom';
import { getChatrooms } from '@/lib/dbQueries';
import Link from 'next/link';

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
            <AvatarDropdown session={session} />
          </div>
        </AppShell.Header>
        <AppShell.Navbar p="md" w={{ base: 250, sm: 300 }}>
          <NavContent />
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

const NavContent = () => {
  const { data: session } = useSession();
  const [chatrooms, setChatrooms] = useState<{ id: number; name: string }[]>();
  const email = session?.user.email as string;

  useEffect(() => {
    getChatrooms(email).then((d) => {
      if (!d) throw new Error('test');
      return setChatrooms(d);
    });
  }, [email]);

  return (
    <>
      <CreateRoomButton />
      {chatrooms?.map((e) => (
        <Link href={e.id === 1 ? '/chat' : `/chat/${e.id}`} key={e.id}>
          <Button variant="transparent">{e.name}</Button>
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
            setOpened(false);
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
