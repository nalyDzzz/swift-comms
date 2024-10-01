export type Message = {
  author: string;
  message: string;
  date: string;
};

export const dummyMessages: Message[] = [
  { author: 'Alice', message: 'Hello, how are you?', date: '2023-01-01' },
  { author: 'Bob', message: 'Just checking in!', date: '2023-02-14' },
  {
    author: 'Charlie',
    message: "Don't forget our meeting tomorrow.",
    date: '2023-03-10',
  },
  { author: 'Diana', message: 'Happy Birthday!', date: '2023-04-22' },
  { author: 'Eve', message: 'Can you send me the report?', date: '2023-05-05' },
  { author: 'Frank', message: "Let's catch up soon.", date: '2023-06-18' },
  { author: 'Grace', message: 'Good morning!', date: '2023-07-30' },
  { author: 'Hank', message: 'See you later.', date: '2023-08-15' },
  { author: 'Ivy', message: 'Thank you!', date: '2023-09-09' },
  {
    author: 'Jack',
    message: 'Congratulations on your achievement!',
    date: '2023-10-31',
  },
];
