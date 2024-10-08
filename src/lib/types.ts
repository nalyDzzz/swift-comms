export type initialMessages = {
  date: Date;
  content: string;
  id?: number;
  author: {
    name: string | null;
    username?: string | null;
    picture?: string | null;
  };
};

export type Chatroom = {
  id: number;
  name: string;
  OwnerId: number;
};
