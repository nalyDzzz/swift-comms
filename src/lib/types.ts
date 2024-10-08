export type initialMessages = {
  date: Date;
  content: string;
  id?: string;
  author: {
    name: string | null;
    username?: string | null;
    picture?: string | null;
  };
};

export type Chatroom = {
  id: string;
  name: string;
  OwnerId: string;
};
