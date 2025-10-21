// RUTA: ./components/supabase/cropImage.ts

import type { Area } from 'react-easy-crop';

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  isSquare: boolean = false
): Promise<File | null> {
  const image = new (window as any).Image();
  image.src = imageSrc;
  await new Promise((resolve) => { image.onload = resolve; });

  const canvas = document.createElement('canvas');
  let cropWidth = pixelCrop.width;
  let cropHeight = pixelCrop.height;
  let cropX = pixelCrop.x;
  let cropY = pixelCrop.y;

  if (isSquare) {
      const size = Math.min(image.width, image.height);
      cropWidth = size;
      cropHeight = size;
      cropX = (image.width - size) / 2;
      cropY = (image.height - size) / 2;
  }
  
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      const file = new File([blob], 'cropped-image.jpeg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 1.0);
  });
}