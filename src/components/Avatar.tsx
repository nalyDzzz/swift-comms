'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type AvatarProps = {
  src?: string | undefined | null;
  alt: string;
  children: React.ReactNode;
  className: string;
};

const Avatar = ({ src, alt, children, className }: AvatarProps) => {
  const [error, setError] = useState(!src);
  useEffect(() => setError(!src), [src]);
  return (
    <span
      className={cn(
        'w-10 h-10 rounded-full bg-gray-950 font-semibold flex justify-center items-center relative',
        className
      )}
    >
      {!error && (
        <Image
          src={src ? src : ''}
          fill
          alt={alt}
          onError={() => setError(true)}
          className="w-full h-full rounded-full"
        />
      )}
      {error && children}
    </span>
  );
};

export default Avatar;
