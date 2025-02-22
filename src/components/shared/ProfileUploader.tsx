import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { UserCircle, Camera } from "@phosphor-icons/react"

import { convertFileToUrl } from "@/lib/utils"

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
}

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl)
  const [isHovered, setIsHovered] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      try {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(convertFileToUrl(acceptedFiles[0]))
      } catch (error) {
        console.error("Erro ao processar arquivo:", error)
      }
    },
    [fieldChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
    maxSize: 4 * 1024 * 1024, // 4MB
  })

  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex-center flex-col gap-2">
        <div className="relative w-24 h-24">
          {fileUrl ? (
            <img
              src={fileUrl || "/placeholder.svg"}
              alt="Foto de perfil"
              className="w-full h-full rounded-full object-cover border-2 border-dark-4 transition-all duration-300 group-hover:border-primary-500"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-dark-4 flex-center">
              <UserCircle size={64} weight="thin" className="text-light-3" />
            </div>
          )}
          
          {/* Overlay de hover */}
          <div
            className={`absolute inset-0 rounded-full flex-center bg-black/50 transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Camera size={24} className="text-light-1" weight="bold" />
          </div>
        </div>

        {/* Texto de ajuda */}
        <p className="text-primary-500 small-regular md:base-medium text-center">
          {isDragActive 
            ? "Solte a imagem aqui" 
            : "Clique ou arraste uma foto"}
        </p>
        <p className="text-light-3 subtle-semibold">
          PNG, JPG ou JPEG (max. 4MB)
        </p>
      </div>
    </div>
  )
}

export default ProfileUploader