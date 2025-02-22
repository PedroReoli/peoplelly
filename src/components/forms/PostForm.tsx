import * as z from "zod"
import { Models } from "appwrite"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, MapPin, Hash, Image as ImageIcon } from "@phosphor-icons/react"
import { useState } from "react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { PostValidation } from "@/lib/validation"
import { useToast } from "@/components/ui/use-toast"
import { useUserContext } from "@/context/AuthContext"
import { FileUploader, Loader } from "@/components/shared"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries"

type PostFormProps = {
  post?: Models.Document
  action: "Create" | "Update"
}

type LocationSuggestion = {
  city: string
  state?: string
  country: string
  formatted: string
}

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()
  const [tags, setTags] = useState<string[]>(post?.tags || [])
  const [currentTag, setCurrentTag] = useState("")
  const [locationInput, setLocationInput] = useState(post?.location || "")
  const [locationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  })

  const { mutateAsync: createPost, isLoading: isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost()

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    form.setValue('location', suggestion.formatted)
    setLocationInput(suggestion.formatted)
    setShowSuggestions(false)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (currentTag.trim() && !tags.includes(currentTag.trim())) {
        const newTags = [...tags, currentTag.trim()]
        setTags(newTags)
        form.setValue('tags', newTags.join(','))
        setCurrentTag("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue('tags', newTags.join(','))
  }

  const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
    if (isUploading) {
      toast({
        title: "Aguarde",
        description: "A imagem ainda está sendo carregada...",
      })
      return
    }

    try {
      if (post && action === "Update") {
        const updatedPost = await updatePost({
          ...values,
          postId: post.$id,
          imageId: post.imageId,
          imageUrl: post.imageUrl,
        })

        if (!updatedPost) {
          throw new Error("Erro ao atualizar o post")
        }

        toast({
          title: "Sucesso!",
          description: "Post atualizado com sucesso",
        })
        
        navigate(`/posts/${post.$id}`)
      } else {
        const newPost = await createPost({
          ...values,
          userId: user.id,
        })

        if (!newPost) {
          throw new Error("Erro ao criar o post")
        }

        toast({
          title: "Sucesso!",
          description: "Post criado com sucesso",
        })
        
        navigate("/")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Algo deu errado. Tente novamente."
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Coluna da Esquerda - Upload e Preview */}
          <div className="flex flex-col bg-dark-3/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={20} className="text-primary-500" weight="light" />
              <h3 className="base-medium text-light-2">Mídia</h3>
            </div>
            
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploader
                      fieldChange={field.onChange}
                      mediaUrl={post?.imageUrl}
                      setIsUploading={setIsUploading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Coluna da Direita - Formulário */}
          <div className="flex flex-col gap-4 bg-dark-3/50 rounded-xl p-4">
            {/* Caption */}
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-2 text-sm">Descrição</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        className="shad-textarea custom-scrollbar !min-h-[100px]"
                        placeholder="O que você quer compartilhar?"
                      />
                      <div className="absolute bottom-2 right-2 text-light-3 text-xs">
                        {field.value.length}/2000
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-light-2 text-sm">Localização</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin 
                        size={16} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3" 
                      />
                      <Input
                        type="text"
                        className="shad-input pl-9"
                        placeholder="Onde foi registrado?"
                        value={locationInput}
                        onChange={(e) => {
                          setLocationInput(e.target.value)
                          field.onChange(e.target.value)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200)
                        }}
                      />
                    </div>
                  </FormControl>
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-dark-2 border border-dark-4 rounded-lg shadow-lg max-h-[150px] overflow-y-auto custom-scrollbar">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-dark-4 cursor-pointer text-light-1 text-sm flex items-center gap-2"
                          onClick={() => handleLocationSelect(suggestion)}
                        >
                          <MapPin size={14} className="text-primary-500" />
                          {suggestion.formatted}
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel className="text-light-2 text-sm">Tags</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="relative">
                        <Hash 
                          size={16} 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3" 
                        />
                        <Input
                          type="text"
                          placeholder="Adicione tags e pressione Enter"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="shad-input pl-9"
                        />
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {tags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 px-2 py-1 bg-primary-500/20 text-primary-500 rounded-full"
                            >
                              <span className="text-xs">#{tag}</span>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-3 w-3 p-0 hover:bg-transparent"
                                onClick={() => removeTag(tag)}
                              >
                                <X size={10} className="text-primary-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Submit Buttons */}
            <div className="flex gap-2 items-center justify-end mt-auto pt-3 border-t border-dark-4">
              <Button
                type="button"
                variant="ghost"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="shad-button_primary"
                disabled={isLoadingCreate || isLoadingUpdate || isUploading}>
                {(isLoadingCreate || isLoadingUpdate) && <Loader />}
                {isUploading ? "Carregando imagem..." : `${action} Post`}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default PostForm