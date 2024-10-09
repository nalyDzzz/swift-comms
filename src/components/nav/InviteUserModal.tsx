import { Chatroom, Invite } from '@/lib/types';
import { ActionIcon, Button, Modal, TextInput, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import Avatar from '../Avatar';
import { useData } from '../context/DataProvider';
import { useSession } from 'next-auth/react';
import { useSocket } from '../context/SocketProvider';

type Props = {
  chatroom: Chatroom;
};

export default function InviteUserModal({ chatroom }: Props) {
  const { socket } = useSocket();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const { users } = useData();
  const filtered = users.filter((e) =>
    e.username?.toLowerCase().includes(search.toLowerCase())
  );

  const checkIfInvited = (toUser: string) => {
    if (!session || !session.user.username) return;
    const fromUser = session.user.username;
    const toUserInvites = users
      .filter((e) => e.username === toUser)
      .map((e) => e.Invites);
    if (toUserInvites.length === 0 || toUserInvites[0] === undefined)
      return false;
    const toUserHasInvite = toUserInvites[0].find((e) => {
      return e.Chatroom.name === chatroom.name && e.from.username === fromUser;
    });
    return toUserHasInvite ? true : false;
  };

  const sendInvite = (toId: string) => {
    if (socket && session && session.user.id) {
      const invite: Invite = {
        fromId: session.user.id,
        toId,
        ChatroomId: chatroom.id,
        Chatroom: { name: chatroom.name },
        from: { username: session.user.username },
      };
      socket.emit('invite', invite);
    }
  };

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
        opened={opened}
        onClose={close}
        title={`Invite friends to ${chatroom.name}`}
        classNames={{ title: 'text-xl font-semibold' }}
      >
        <div className="h-96">
          <TextInput
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            placeholder="Search friends"
          />
          <div className="flex flex-col gap-2 w-full p-2 h-[92%] overflow-y-scroll overflow-x-hidden">
            {filtered.map((el) => (
              <div
                key={el.id}
                className="flex gap-2 items-center w-full dark:hover:bg-dark-5 hover:bg-dark-1 rounded p-2"
              >
                <Avatar src={el.picture} alt="profile picture" />
                <span className="font-medium">{el.username}</span>
                <div className="flex items-center justify-end grow">
                  <Button
                    variant="outline"
                    size="compact-md"
                    className="font-normal text-sm"
                    onClick={() => sendInvite(el.id)}
                    color={
                      !checkIfInvited(el.username as string) ? 'blue' : 'green'
                    }
                  >
                    {!checkIfInvited(el.username as string)
                      ? 'Invite'
                      : 'Invited'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
