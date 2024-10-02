export type initialMessages = {
  date: Date;
  content: string;
  author: {
    name: string;
    username?: string | null;
    picture?: string;
  };
};
