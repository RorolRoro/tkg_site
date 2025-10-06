'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Image, X, Upload } from 'lucide-react'

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // en MB
}

export function PhotoUpload({ onUpload, maxFiles = 5, maxSize = 10 }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles: File[] = []
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        if (file.size <= maxSize * 1024 * 1024) {
          validFiles.push(file)
        } else {
          alert(`Le fichier ${file.name} est trop volumineux (max ${maxSize}MB)`)
        }
      } else {
        alert(`Le fichier ${file.name} n'est pas une image valide`)
      }
    })

    if (validFiles.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles)
      setSelectedFiles([])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
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
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">
          Glissez-déposez vos images ici ou{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary-400 hover:text-primary-300 underline"
          >
            parcourez vos fichiers
          </button>
        </p>
        <p className="text-gray-500 text-sm">
          Maximum {maxFiles} fichiers, {maxSize}MB par fichier
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Fichiers sélectionnés:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-dark-800 p-3 rounded">
                <div className="flex items-center space-x-3">
                  <Image className="h-5 w-5 text-primary-400" />
                  <div>
                    <p className="text-white text-sm">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            onClick={handleUpload}
            variant="glow"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Envoyer {selectedFiles.length} fichier(s)
          </Button>
        </div>
      )}
    </div>
  )
}

