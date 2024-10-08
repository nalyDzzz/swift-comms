'use client';
import React, {
  FormEvent,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
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
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import Avatar from './Avatar';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import { signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { addChatroom, editChatroom } from '@/lib/formval';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoIosSettings } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { FaTrash } from 'react-icons/fa';
import { deleteChatroom } from '@/lib/dbQueries';

type Chatroom = {
  id: number;
  name: string;
  OwnerId: number;
};

type AppLayoutProps = PropsWithChildren & {
  chatrooms: Chatroom[] | undefined;
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

const NavContent = ({ chatrooms }: { chatrooms: Chatroom[] | undefined }) => {
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
        <Link
          href={e.id === 1 ? '/chat' : `/chat/${e.id}`}
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
  return (
    <div
      className={cn(
        { 'group-hover:visible': chatroom.id !== 1 },
        'group invisible z-50'
      )}
    >
      <Tooltip
        label="Invite Friend"
        withArrow
        transitionProps={{ transition: 'pop' }}
      >
        <ActionIcon aria-label="Invite Friend" variant="transparent">
          <FaUserFriends />
        </ActionIcon>
      </Tooltip>
      <ChangeNameModal chatroom={chatroom} />
    </div>
  );
};

const ChangeNameModal = ({ chatroom }: { chatroom: Chatroom }) => {
  const initialState = { errors: [] };
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const [state, action] = useFormState(editChatroom, initialState);
  const [check, setCheck] = useState(false);
  const ref = useClickOutside(() => setCheck(false));
  const { data: session } = useSession();
  const userId = parseInt(session?.user.id || '');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set('id', chatroom.id.toString());
    action(formData);
  };

  useEffect(() => {
    if (state?.errors.length === 0 || !state?.errors) {
      setOpened(false);
    }
  }, [state?.errors, action]);

  const handleDelete = async () => {
    if (userId !== chatroom.OwnerId) {
      return;
    } else {
      await deleteChatroom(chatroom.id);
    }
  };

  return (
    <Popover opened={opened} onChange={setOpened} withArrow>
      <Popover.Target>
        <Tooltip
          label="Rename or Delete"
          withArrow
          transitionProps={{ transition: 'pop' }}
        >
          <ActionIcon
            aria-label="Edit"
            variant="transparent"
            onClick={() => setOpened((o) => !o)}
          >
            <IoIosSettings />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-col items-center gap-2">
          <form onSubmit={onSubmit}>
            <TextInput
              label="Edit name"
              type="text"
              placeholder="My Chatroom"
              error={state?.errors[0]?.message}
              name="chatroom"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </form>
          {!check && (
            <Button
              color="red"
              rightSection={<FaTrash />}
              onClick={() => setCheck(!check)}
              disabled={userId !== chatroom.OwnerId}
            >
              Delete
            </Button>
          )}
          {check && (
            <div ref={ref}>
              <h5 className="font-bold text-center">Are you sure?</h5>
              <div className="flex flex-row gap-2">
                <Button color="red" onClick={handleDelete}>
                  Yes
                </Button>
                <Button color="gray" onClick={() => setCheck(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
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
