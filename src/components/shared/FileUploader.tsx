import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { UploadSimple } from "@phosphor-icons/react"

import { convertFileToUrl } from "@/lib/utils"

type FileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
  setIsUploading?: (isUploading: boolean) => void
}

const FileUploader = ({ fieldChange, mediaUrl, setIsUploading }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setIsUploading?.(true)
      fieldChange(acceptedFiles)
      setFileUrl(convertFileToUrl(acceptedFiles[0]))
      setTimeout(() => setIsUploading?.(false), 1000)
    },
    [fieldChange, setIsUploading]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  })

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-[240px] 
                rounded-xl cursor-pointer border-2 border-dashed
                transition-all duration-300 ease-in-out
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-500/10' 
                  : 'border-dark-4 bg-dark-3 hover:border-primary-500/50 hover:bg-dark-4'}`}>
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <div className="relative flex items-center justify-center w-full h-full">
          <img 
            src={fileUrl || "/placeholder.svg"} 
            alt="preview" 
            className="w-full h-full object-cover rounded-lg" 
          />
          <div className="absolute inset-0 bg-dark-1/50 backdrop-blur-[2px] flex flex-col gap-2 
                         items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
            <UploadSimple size={24} className="text-light-1" weight="light" />
            <p className="text-light-1 text-sm">Clique para trocar a imagem</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
          <UploadSimple size={32} className="text-primary-500" weight="light" />
          <div className="flex flex-col gap-1">
            <p className="text-light-2 base-medium">
              Arraste e solte sua imagem aqui
            </p>
            <p className="text-light-3 small-regular">
              SVG, PNG, JPG ou JPEG (max. 5MB)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader