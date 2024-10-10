import { addChatroom } from '@/lib/formval';
import { Popover, Button, TextInput, FocusTrap } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

type Props = {};

export default function CreateRoomButton({}: Props) {
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
        <Button
          variant="outline"
          onClick={() => setOpened(!opened)}
          className="min-h-9 w-full"
        >
          Create Chat Room
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <FocusTrap active={opened}>
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
              data-autofocus
            />
          </form>
        </FocusTrap>
      </Popover.Dropdown>
    </Popover>
  );
}
