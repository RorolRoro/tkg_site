'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Image, Video, Link as LinkIcon, X, Upload, Plus } from 'lucide-react'
import { Input } from './input'

export interface MediaItem {
  type: 'image' | 'video' | 'link'
  url: string
  name?: string
  file?: File
  dataUrl?: string // Base64 pour la persistance
}

interface MediaUploadProps {
  onMediaChange: (media: MediaItem[]) => void
  maxFiles?: number
  maxSize?: number // en MB
}

export function MediaUpload({ onMediaChange, maxFiles = 10, maxSize = 50 }: MediaUploadProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null, type: 'image' | 'video') => {
    if (!files) return

    const validFiles: File[] = []
    
    Array.from(files).forEach(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      
      if ((type === 'image' && isImage) || (type === 'video' && isVideo)) {
        if (file.size <= maxSize * 1024 * 1024) {
          validFiles.push(file)
        } else {
          alert(`Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`)
        }
      } else {
        alert(`Le fichier ${file.name} n'est pas un ${type === 'image' ? 'image' : 'vidéo'} valide`)
      }
    })

    if (validFiles.length + mediaItems.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Convertir les fichiers en base64 pour la persistance
    const newMediaPromises = validFiles.map(async (file) => {
      const blobUrl = URL.createObjectURL(file)
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      
      return {
        type,
        url: blobUrl,
        dataUrl,
        name: file.name,
        file
      } as MediaItem
    })

    const newMedia = await Promise.all(newMediaPromises)

    const updatedMedia = [...mediaItems, ...newMedia]
    setMediaItems(updatedMedia)
    onMediaChange(updatedMedia)
  }

  const addLink = () => {
    if (!linkUrl.trim()) return

    // Vérifier si c'est une URL valide
    try {
      new URL(linkUrl)
    } catch {
      alert('Veuillez entrer une URL valide')
      return
    }

    const newMedia: MediaItem = {
      type: 'link',
      url: linkUrl.trim(),
      name: linkUrl.trim()
    }

    const updatedMedia = [...mediaItems, newMedia]
    setMediaItems(updatedMedia)
    onMediaChange(updatedMedia)
    setLinkUrl('')
    setShowLinkInput(false)
  }

  const removeMedia = (index: number) => {
    const updatedMedia = mediaItems.filter((_, i) => i !== index)
    setMediaItems(updatedMedia)
    onMediaChange(updatedMedia)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    const imageFiles: File[] = []
    const videoFiles: File[] = []
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        imageFiles.push(file)
      } else if (file.type.startsWith('video/')) {
        videoFiles.push(file)
      }
    })

    if (imageFiles.length > 0) {
      await handleFileSelect({ ...files, length: imageFiles.length } as FileList, 'image')
    }
    if (videoFiles.length > 0) {
      await handleFileSelect({ ...files, length: videoFiles.length } as FileList, 'video')
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2"
        >
          <Image className="h-4 w-4" />
          <span>Ajouter des images</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => videoInputRef.current?.click()}
          className="flex items-center space-x-2"
        >
          <Video className="h-4 w-4" />
          <span>Ajouter une vidéo</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="flex items-center space-x-2"
        >
          <LinkIcon className="h-4 w-4" />
          <span>Ajouter un lien</span>
        </Button>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files, 'image')}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        multiple
        accept="video/*"
        onChange={(e) => handleFileSelect(e.target.files, 'video')}
        className="hidden"
      />

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex gap-2">
          <Input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://exemple.com"
            className="flex-1 bg-dark-800/50 border-dark-700 text-white"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addLink()
              }
            }}
          />
          <Button
            type="button"
            variant="glow"
            size="sm"
            onClick={addLink}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-primary-400 bg-primary-400/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-300 text-sm mb-1">
          Glissez-déposez vos images ou vidéos ici
        </p>
        <p className="text-gray-500 text-xs">
          Maximum {maxFiles} fichiers, {maxSize}MB par fichier
        </p>
      </div>

      {/* Media Preview */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium text-sm">Médias ajoutés ({mediaItems.length}):</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mediaItems.map((item, index) => (
              <div key={index} className="relative bg-dark-800 rounded-lg overflow-hidden group">
                {item.type === 'image' && (
                  <div className="aspect-video bg-dark-700 flex items-center justify-center">
                    <img
                      src={item.dataUrl || item.url}
                      alt={item.name || `Image ${index + 1}`}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        // Fallback sur l'URL blob si dataUrl échoue
                        if (item.url && e.currentTarget.src !== item.url) {
                          e.currentTarget.src = item.url
                        }
                      }}
                    />
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="aspect-video bg-dark-700 flex items-center justify-center">
                    <video
                      src={item.dataUrl || item.url}
                      controls
                      className="max-h-full max-w-full"
                      onError={(e) => {
                        // Fallback sur l'URL blob si dataUrl échoue
                        if (item.url && e.currentTarget.src !== item.url) {
                          e.currentTarget.src = item.url
                        }
                      }}
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                  </div>
                )}
                {item.type === 'link' && (
                  <div className="p-4 bg-dark-700">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="h-5 w-5 text-primary-400" />
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 hover:text-primary-300 text-sm truncate flex-1"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedia(index)}
                    className="bg-dark-900/80 hover:bg-dark-900 text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {item.name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-dark-900/80 p-2">
                    <p className="text-white text-xs truncate">{item.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

