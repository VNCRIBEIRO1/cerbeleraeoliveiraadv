'use client';

import { useRef, useEffect, useState } from 'react';

interface CanvasLogoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  whiteThreshold?: number;
}

export default function CanvasLogo({
  src,
  alt,
  width,
  height,
  className = '',
  whiteThreshold = 220,
}: CanvasLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > whiteThreshold) {
          // Smooth transition for anti-aliased edges
          const factor =
            (brightness - whiteThreshold) / (255 - whiteThreshold);
          data[i + 3] = Math.round(data[i + 3] * (1 - factor));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src, whiteThreshold]);

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      ) : (
        <div
          style={{ width, height }}
          className={`${className} animate-pulse opacity-0`}
        />
      )}
    </>
  );
}
