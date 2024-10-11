import { Button, Text } from '@mantine/core';
import Image from 'next/image';
import Logo from '@/../public/logo512.png';
import { FaGithub } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="container mx-auto h-screen">
      <div className="flex flex-col justify-center items-center">
        <Image src={Logo} alt="logo" width={360} height={360} />
        <h1 className="text-6xl text-center font-bold">
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'primary.1', to: 'primary.8', deg: 200 }}
            inherit
          >
            Swift Comms
          </Text>
        </h1>
        <p className="text-dark-6 dark:text-dark-2 text-lg">
          A realtime chat messaging application built on NextJS.
        </p>
        <div className="flex gap-2 mt-2">
          <Button size="md" component="a" href="/chat">
            Log in
          </Button>
          <Button
            color="dark.4"
            size="md"
            component="a"
            href="https://github.com/nalyDzzz/swift-comms"
          >
            <FaGithub size="2em" />
          </Button>
        </div>
      </div>
    </div>
  );
}
