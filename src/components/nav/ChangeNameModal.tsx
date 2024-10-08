import { deleteChatroom } from '@/lib/dbQueries';
import { editChatroom } from '@/lib/formval';
import { Chatroom } from '@/lib/types';
import { Popover, Tooltip, ActionIcon, TextInput, Button } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useSession } from 'next-auth/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { FaTrash } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';

export default function ChangeNameModal({ chatroom }: { chatroom: Chatroom }) {
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
}
