// RUTA: ./components/supabase/img/UploadImg.tsx

'use client'
import React, { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import imageCompression from 'browser-image-compression'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import getCroppedImg from './cropImage'
import { toast } from 'react-toastify' // Importar toast

const MAX_DIMENSION = 1080
const MAX_FILE_SIZE = 500 * 1024

const optimizeImage = async (file: File, isSquare: boolean): Promise<File | null> => {
    let fileToProcess: File | null = file;
    if (isSquare) {
        const url = URL.createObjectURL(file);
        const cropped = await getCroppedImg(url, { width: 0, height: 0, x: 0, y: 0 }, true);
        URL.revokeObjectURL(url);
        if (!cropped) {
            console.error("El recorte falló, se usará la imagen original.");
            fileToProcess = file;
        } else {
            fileToProcess = cropped;
        }
    }
    if (!fileToProcess) return null;
    const options = {
      maxSizeMB: MAX_FILE_SIZE / 1024 / 1024,
      maxWidthOrHeight: MAX_DIMENSION,
      useWebWorker: false,
      fileType: 'image/jpeg',
    }
    try {
        const compressedFile = await imageCompression(fileToProcess, options);
        return new File([compressedFile], fileToProcess.name.replace(/\.[^/.]+$/, ".jpeg"), {
            type: compressedFile.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error("Error durante la compresión:", error);
        return null;
    }
}

interface UploadProps {
    bucketName: string;
    filePath: string;
    onSuccess: (url: string) => void;
    onError: (errorMsg: string) => void; // Mantenemos onError para notificar al padre
    label?: string;
    isSquare?: boolean;
    disabled?: boolean;
}

export default function UploadImg({
    bucketName,
    filePath,
    onSuccess,
    onError,
    label = 'Subir Archivo',
    isSquare = false,
    disabled = false
}: UploadProps) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => setImageSrc(reader.result as string))
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      toast.error("No se pudo obtener el área de recorte."); // Usar toast
      onError("No se pudo obtener el área de recorte.");
      return;
    }
    try {
      setUploading(true);
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageFile) throw new Error("No se pudo recortar la imagen.");
      const optimizedFile = await optimizeImage(croppedImageFile, false);
      if (!optimizedFile) throw new Error("Fallo la optimización de la imagen.");
      if (optimizedFile.size > MAX_FILE_SIZE) {
          throw new Error(`El archivo optimizado (${(optimizedFile.size / 1024).toFixed(0)} KB) supera el límite.`);
      }
      const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, optimizedFile, {
              cacheControl: '3600',
              upsert: true,
          });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error("No se pudo obtener la URL pública del archivo.");
      }
      onSuccess(publicUrlData.publicUrl + `?t=${new Date().getTime()}`);
      setImageSrc(null)
    } catch (error) {
      const errorMsg = 'Error subiendo el archivo: ' + (error as Error).message;
      toast.error(errorMsg); 
      onError(errorMsg);
    } finally {
      setUploading(false)
    }
  }

  const handleCancelCrop = () => {
    setImageSrc(null);
    const input = document.getElementById('single-upload') as HTMLInputElement;
    if (input) input.value = '';
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full">
        <label
            className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed block cursor-pointer text-center ${disabled || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            htmlFor="single-upload"
        >
          {uploading ? 'Procesando...' : label}
        </label>
<input
          style={{ display: 'none' }}
          type="file"
          id="single-upload"
          accept="image/jpeg, image/png, image/gif, image/webp, image/heic, image/heif, .jpg, .jpeg, .png, .gif, .webp, .heic, .heif"
          onChange={onFileChange}
          disabled={disabled || uploading}
        />
      </div>
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Recortar Imagen</h2>
            <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={isSquare ? 1 : undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
                classes={{ containerClassName: 'bg-gray-200', mediaClassName: 'object-contain' }}
              />
            </div>
            <div className="mt-5 flex justify-between space-x-3">
              <button
                onClick={handleCancelCrop}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                disabled={uploading}
              >
                {uploading ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}