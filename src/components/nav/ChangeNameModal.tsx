'use client';
import { deleteChatroom, leaveChatroom } from '@/lib/dbQueries';
import { editChatroom } from '@/lib/formval';
import { Chatroom } from '@/lib/types';
import {
  Popover,
  Tooltip,
  ActionIcon,
  TextInput,
  Button,
  FocusTrap,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { FaTrash } from 'react-icons/fa';
import { IoIosSettings, IoMdExit } from 'react-icons/io';

export default function ChangeNameModal({ chatroom }: { chatroom: Chatroom }) {
  const initialState = { errors: [] };
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');
  const [state, action] = useFormState(editChatroom, initialState);
  const [check, setCheck] = useState(false);
  const ref = useClickOutside(() => setCheck(false));
  const { data: session } = useSession();
  const userId = session?.user.id || '';
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOwner) return;
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

  const handleLeave = async () => {
    await leaveChatroom(chatroom.id, userId);
    router.push('/chat');
  };

  const isOwner = userId === chatroom.OwnerId;

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withArrow
      transitionProps={{ transition: 'scale' }}
    >
      <Popover.Target>
        <Tooltip
          label={isOwner ? 'Rename or Delete' : 'Leave'}
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
          <FocusTrap active={opened}>
            <form onSubmit={onSubmit}>
              {isOwner && (
                <TextInput
                  label="Edit name"
                  type="text"
                  placeholder="My Chatroom"
                  error={state?.errors[0]?.message}
                  name="chatroom"
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  disabled={!isOwner}
                  data-autofocus
                />
              )}
            </form>
          </FocusTrap>
          {!check && (
            <Button
              color="red"
              rightSection={isOwner ? <FaTrash /> : <IoMdExit />}
              onClick={() => setCheck(!check)}
            >
              {isOwner ? 'Delete' : 'Leave'}
            </Button>
          )}
          {check && (
            <div ref={ref}>
              <h5 className="font-bold text-center">Are you sure?</h5>
              <div className="flex flex-row gap-2">
                {isOwner && (
                  <Button color="red" onClick={handleDelete}>
                    Yes
                  </Button>
                )}
                {!isOwner && (
                  <Button color="red" onClick={handleLeave}>
                    Yes
                  </Button>
                )}
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
}
