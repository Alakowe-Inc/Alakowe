import { upload } from '@imagekit/react'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
const UPLOAD_FOLDER = import.meta.env.VITE_CLOUDINARY_UPLOAD_FOLDER || 'uat/listing'

export const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png']
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

export function isImageTypeAllowed(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ALLOWED_IMAGE_TYPES.includes(ext) && ALLOWED_MIME_TYPES.includes(file.type)
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

export async function compressImage(file: File, maxWidth = 1000, quality = 0.75): Promise<Blob> {
  const img = await loadImage(file)
  let { width, height } = img
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('Compression failed'))
    }, 'image/jpeg', quality)
  })
}

export async function uploadToImageKit(file: Blob, fileName: string): Promise<string> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return fileName
  }
  const token = localStorage.getItem('token')
  const authRes = await fetch(`${import.meta.env.VITE_API_URL || 'https://localhost:7175/'}api/v1/Upload/imagekit-auth`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!authRes.ok) {
    throw new Error(`ImageKit auth failed: ${await authRes.text()}`)
  }
  const { signature, expire, token: uploadToken, publicKey, folder } = await authRes.json()
  const data = await upload({
    file,
    fileName: fileName.replace(/\.[^.]+$/, '.jpg'),
    signature,
    expire,
    token: uploadToken,
    publicKey,
    ...(folder ? { folder } : {}),
  })
  return data.name as string
}
export async function uploadImage(file: Blob, fileName: string): Promise<string> {
  try {
    // return await uploadToCloudinary(file, fileName)
    return uploadToImageKit(file, fileName)
  } catch (err) {
    console.warn('Cloudinary upload failed, falling back to ImageKit', err)
  }
}

export async function uploadToCloudinary(file: Blob, fileName: string): Promise<string> {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    return fileName
  }
  const formData = new FormData()
  formData.append('file', file, fileName.replace(/\.[^.]+$/, '.jpg'))
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', UPLOAD_FOLDER)
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary upload failed: ${text}`)
  }
  const data = await res.json()
  return `${(data.public_id as string).replace(`${UPLOAD_FOLDER}/`, '')}.${data.format as string}`
}
