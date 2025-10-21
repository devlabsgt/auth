// RUTA: ./components/account/Avatar.tsx

'use client'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { type User } from '@supabase/supabase-js'
import UploadImg from '@/components/supabase/img/UploadImg'
import { toast } from 'react-toastify'

export default function Avatar({
  uid,
  url,
  width,
  height,
  onUpload,
  user,
}: {
  uid: string | null
  url: string | null
  width: number
  height: number
  onUpload: (filePath: string) => void
  user: User | null
}) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    function getPublicUrlFromPath(filePath: string): string | null {
      if (!filePath) return null;
      try {
        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        return data?.publicUrl ? `${data.publicUrl}?t=${new Date().getTime()}` : null;
      } catch (error) {
        console.error('Error getting public URL:', error);
        return null;
      }
    }
    const publicUrl = getPublicUrlFromPath(url || '');
    setAvatarUrl(publicUrl);
  }, [url, supabase]);

  const handleUploadSuccess = (publicUrl: string) => {
    if (!publicUrl || typeof publicUrl !== 'string') {
      toast.error("La URL recibida después de subir no es válida.");
      return;
    }
    setAvatarUrl(publicUrl);
    try {
      const urlObject = new URL(publicUrl);
      const pathParts = urlObject.pathname.split('/');
      const bucketIndex = pathParts.indexOf('avatars');
      if (bucketIndex === -1 || bucketIndex + 1 >= pathParts.length) {
        throw new Error("Could not parse filePath from public URL");
      }
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      onUpload(filePath);
    } catch (e) {
      console.error("Failed to extract filePath:", e);
      toast.error("No se pudo procesar la URL de la imagen subida.");
    }
  }

  const handleUploadError = (error: string) => {
    toast.error(error);
  }

  const avatarFilePath = `${uid}/profile.jpeg`;

  const triggerFileInput = () => {
    const uploadInput = document.getElementById('single-upload');
    if (uploadInput) {
        uploadInput.click();
    }
  }

  return (
    <div className="relative group cursor-pointer w-full h-full bg-gray-100 rounded-t-lg overflow-hidden" onClick={triggerFileInput}>
      {avatarUrl ? (
        <Image
          key={avatarUrl}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          src={avatarUrl}
          alt="Avatar"
          className="block"
          priority
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-100 border-b border-gray-200 rounded-t-lg"
          style={{ height: height }}
        >
          {user?.email?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 pointer-events-none rounded-t-lg">
      </div>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Haz clic para cambiar
      </span>
      <div style={{ width: 0, height: 0, overflow: 'hidden' }}>
        <UploadImg
          bucketName="avatars"
          filePath={avatarFilePath}
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          isSquare={true}
        />
      </div>
    </div>
  )
}