'use client';
import { Button, Popover } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import {
  IoMdMail,
  IoMdMailOpen,
  IoMdCheckmark,
  IoMdClose,
} from 'react-icons/io';
import { useSocket } from '../context/SocketProvider';

type Props = {};

export default function Invites({}: Props) {
  const [opened, setOpened] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('invite', () => {
        console.log('invite');
      });
    }

    return () => {
      if (socket) {
        socket.off('invite');
      }
    };
  }, [socket]);

  return (
    <Popover withArrow opened={opened} onChange={setOpened}>
      <Popover.Target>
        <a className="cursor-pointer" onClick={() => setOpened((o) => !o)}>
          {opened ? <IoMdMailOpen size="1.5em" /> : <IoMdMail size="1.5em" />}
        </a>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="flex flex-col gap-2">
          <h5 className="text-xl font-semibold text-center">Invites</h5>
          <div className="flex flex-row gap-2 items-center">
            <span>
              <span className="font-medium">Username</span> invited you to join{' '}
              <span className="font-medium">Chatroom</span>
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
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
