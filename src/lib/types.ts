export type initialMessages = {
  date: Date;
  content: string;
  author: {
    name: string | null;
    username?: string | null;
    picture?: string | null;
  };
};
