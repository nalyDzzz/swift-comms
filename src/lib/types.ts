import { Prisma } from '@prisma/client';
import { getMessages } from '@/lib/dbQueries';

export type initialMessage = Prisma.MessageGetPayload<{
  select: {
    date: true;
    id: true;
    author: { select: { name: true; username: true; picture: true } };
    content: true;
  };
}>;

export type SendMessage = Prisma.MessageGetPayload<{
  select: {
    date: true;
    author: { select: { name: true; username: true; picture: true } };
    content: true;
  };
}>;

export type initialMessages = Prisma.PromiseReturnType<typeof getMessages>;

export type Invite = Prisma.InviteGetPayload<{
  select: {
    id: true;
    fromId: true;
    toId: true;
    ChatroomId: true;
    from: { select: { username: true } };
    Chatroom: { select: { name: true } };
  };
}>;

export type SendInvite = Prisma.InviteGetPayload<{
  select: {
    fromId: true;
    toId: true;
    ChatroomId: true;
    from: { select: { username: true } };
    Chatroom: { select: { name: true } };
  };
}>;

export type Chatroom = {
  id: string;
  name: string;
  OwnerId: string | null;
};

export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    username: true;
    picture: true;
    Invites: {
      select: {
        from: { select: { username: true } };
        to: { select: { username: true } };
        Chatroom: { select: { name: true } };
      };
    };
  };
}>;
