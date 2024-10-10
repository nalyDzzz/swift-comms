'use client';
import React from 'react';
import LogoPng from '@/../public/logo.png';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <a className="flex flex-row items-center" href="/">
      <div className={cn('w-12 h-12 relative', className)}>
        <Image src={LogoPng} alt="logo" width={48} height={48} />
      </div>
      <h2 className="text-xl font-bold l tracking-tighter antialiased">
        Swift Comms
      </h2>
    </a>
  );
}
