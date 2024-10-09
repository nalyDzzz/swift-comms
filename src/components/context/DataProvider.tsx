'use client';
import type { Invite, User } from '@/lib/types';
import { Chatroom } from '@prisma/client';
import React, { createContext, useContext } from 'react';

interface DataContextProps {
  users: User[];
  chatrooms: Chatroom[];
  invites: Invite[];
}

const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const useData = () => {
  return useContext(DataContext);
};

type DataProviderProps = React.PropsWithChildren & {
  users: User[];
  chatrooms: Chatroom[];
  invites: Invite[];
};

export const DataProvider = (props: DataProviderProps) => {
  return (
    <DataContext.Provider
      value={{
        users: props.users,
        chatrooms: props.chatrooms,
        invites: props.invites,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
