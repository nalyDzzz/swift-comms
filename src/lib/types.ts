export type initialMessages = {
  date: Date;
  content: string;
  id: number;
  author: {
    name: string | null;
    username?: string | null;
    picture?: string | null;
  };
};
