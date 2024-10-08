import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existingChatroom = await prisma.chatroom.findUnique({
    where: {
      id: '1',
    },
  });
  if (!existingChatroom) {
    await prisma.chatroom.create({
      data: {
        id: '1',
        name: 'Global',
        Owner: {
          create: {
            id: '1',
            email: 'rootuser',
          },
        },
      },
    });
    console.log('Global chatroom created');
  } else {
    console.log('Global chatroom already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
