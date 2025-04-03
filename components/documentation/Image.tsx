import React from 'react';
import NextImage from 'next/image';

interface ImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  maxFigureWidth?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt = 'Image',
  caption,
  className,
  maxFigureWidth = 'revert-layer',
  width = 600,
  height = 300,
  loading = 'lazy',
}) => {
  return (
    <figure className={className} style={{ width: '100%', height: 'auto', maxWidth: maxFigureWidth }}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        layout="responsive"
        objectFit="contain"
      />
      {caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{caption}</figcaption>}
    </figure>
  );
};