'use client';
import React, { useState } from 'react';
import { Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFormState } from 'react-dom';
import { addUsername } from '@/lib/formval';
import { useSession } from 'next-auth/react';
import { useIsomorphicEffect } from '@mantine/hooks';

const initialState = { errors: [] };

const AddUsernameModal = () => {
  const { data: session } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [state, formAction] = useFormState(addUsername, initialState);
  const [value, setValue] = useState('');

  useIsomorphicEffect(() => {
    if (!session?.user.username) {
      open();
    }
  });

  return (
    <Modal opened={opened} onClose={close} withCloseButton={false} radius="lg">
      <div className="flex flex-col items-center p-4">
        <h3 className="text-xl">Please choose a username</h3>
        <form
          action={async (formData) => {
            await formAction(formData);
            setValue('');
            close();
          }}
        >
          <TextInput
            error={state?.errors[0]?.message}
            placeholder="Username"
            value={value}
            name="username"
            onChange={(e) => setValue(e.target.value)}
          />
        </form>
      </div>
    </Modal>
  );
};

export default AddUsernameModal;
