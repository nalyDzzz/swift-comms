import type { Chatroom, SendInvite } from '@/lib/types';
import {
  ActionIcon,
  Button,
  FocusTrap,
  Modal,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import Avatar from '../Avatar';
import { useData } from '../context/DataProvider';
import { useSession } from 'next-auth/react';
import { useSocket } from '../context/SocketProvider';

type Props = {
  chatroom: Chatroom;
};

export default function InviteUserModal({ chatroom }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const [search, setSearch] = useState('');
  const { users } = useData();
  const notPartOfChat = users.filter(
    (e) => !e.chatrooms.some((chat) => chat.id === chatroom.id)
  );
  const filtered = notPartOfChat.filter((e) =>
    e.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Tooltip
        label="Invite Friend"
        withArrow
        transitionProps={{ transition: 'pop' }}
      >
        <ActionIcon
          aria-label="Invite Friend"
          variant="transparent"
          onClick={open}
        >
          <FaUserFriends />
        </ActionIcon>
      </Tooltip>
      <Modal
        transitionProps={{ transition: 'scale' }}
        opened={opened}
        onClose={close}
        title={`Invite friends to ${chatroom.name}`}
        classNames={{ title: 'text-xl font-semibold' }}
      >
        <div className="h-96">
          <FocusTrap active={opened}>
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="Search friends"
              data-autofocus
            />
          </FocusTrap>
          <div className="flex flex-col gap-2 w-full p-2 h-[92%] overflow-y-auto overflow-x-hidden">
            {filtered.map((el) => (
              <UserList
                chatroom={chatroom}
                username={el.username as string}
                key={el.id}
                id={el.id}
                picture={el.picture as string}
              />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

type UserListProps = {
  chatroom: Chatroom;
  picture: string;
  username: string;
  id: string;
};

const UserList = ({ chatroom, picture, username, id }: UserListProps) => {
  const { socket } = useSocket();
  const { data: session } = useSession();
  const { users } = useData();
  const [isInvited, setIsInvited] = useState(false);

  const sendInvite = () => {
    if (isInvited) return;
    if (socket && session && session.user.id) {
      const invite: SendInvite = {
        fromId: session.user.id,
        toId: id,
        ChatroomId: chatroom.id,
        Chatroom: { name: chatroom.name },
        from: { username: session.user.username },
      };
      socket.emit('invite', invite);
      setIsInvited(true);
    }
  };

  useEffect(() => {
    const checkIfInvited = () => {
      if (!session || !session.user.username) return;
      const fromUser = session.user.username;
      const toUserInvites = users
        .filter((e) => e.username === username)
        .map((e) => e.Invites);
      if (toUserInvites.length === 0 || !toUserInvites[0])
        return setIsInvited(false);
      const toUserHasInvite = toUserInvites[0].some((e) => {
        return e.Chatroom.id === chatroom.id && e.from.username === fromUser;
      });
      return setIsInvited(toUserHasInvite);
    };

    checkIfInvited();
  }, [chatroom.id, username, session, users]);

  return (
    <div className="flex gap-2 items-center w-full dark:hover:bg-dark-5 hover:bg-dark-1 rounded p-2">
      <Avatar src={picture} alt="profile picture" />
      <span className="font-medium">{username}</span>
      <div className="flex items-center justify-end grow">
        <Button
          variant="outline"
          size="compact-md"
          className="font-normal text-sm"
          disabled={isInvited}
          onClick={sendInvite}
          color={isInvited ? 'green' : 'primary'}
        >
          {isInvited ? 'Invited' : 'Invite'}
        </Button>
      </div>
    </div>
  );
};
