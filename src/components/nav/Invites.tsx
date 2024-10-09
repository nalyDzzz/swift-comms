'use client';
import { Button, Indicator, Popover } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
  IoMdMail,
  IoMdMailOpen,
  IoMdCheckmark,
  IoMdClose,
} from 'react-icons/io';
import { useSocket } from '../context/SocketProvider';
import type { Invite } from '@/lib/types';
import { useData } from '../context/DataProvider';

type Props = {};

export default function Invites({}: Props) {
  const { invites: dbInvites } = useData();
  const [opened, setOpened] = useState(false);
  const { socket } = useSocket();
  const [invites, setInvites] = useState<Invite[]>(dbInvites);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('invite', (invite: Invite) => {
        setInvites((prev) => [...prev, invite]);
        setPinging(true);
      });
    }

    return () => {
      if (socket) {
        socket.off('invite');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (invites.length >= 1) {
      setPinging(true);
    }
  }, [invites]);

  const handleOpen = () => {
    setOpened((o) => !o);
    setPinging(false);
  };

  return (
    <Popover withArrow opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Indicator
          position="top-start"
          offset={1}
          color="red"
          processing
          disabled={!pinging}
        >
          <a className="cursor-pointer" onClick={handleOpen}>
            {opened ? <IoMdMailOpen size="1.5em" /> : <IoMdMail size="1.5em" />}
          </a>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-semibold text-center">Invites</h5>
          {invites.map((e, i) => (
            <div
              className="flex flex-row gap-2 items-center"
              key={i + invites.length}
            >
              <span>
                <span className="font-medium">{e.from.username}</span> invited
                you to join{' '}
                <span className="font-medium">{e.Chatroom.name}</span>
              </span>
              <div className="flex gap-2">
                <Button color="green" size="compact-md">
                  <IoMdCheckmark size="1.2em" />
                </Button>
                <Button color="red" size="compact-md">
                  <IoMdClose size="1.2em" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
