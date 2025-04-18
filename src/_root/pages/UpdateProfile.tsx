import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import { PencilSimple } from "@phosphor-icons/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "@/components/shared"
import ProfileUploader from "@/components/shared/ProfileUploader"

import { ProfileValidation } from "@/lib/validation"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById, useUpdateUser } from "@/lib/react-query/queries"

const UpdateProfile = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, setUser } = useUserContext()
  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  })

  // Queries
  const { data: currentUser } = useGetUserById(id || "")
  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser()

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )

  // Handler
  const handleUpdate = async (value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser.imageUrl,
      imageId: currentUser.imageId,
    })

    if (!updatedUser) {
      toast({
        title: "Falha ao atualizar perfil. Tente novamente.",
        variant: "destructive"
      })
      return
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    })

    toast({
      title: "Perfil atualizado com sucesso!",
      className: "bg-primary-500 text-white",
    })

    return navigate(`/profile/${id}`)
  }

  return (
    <div className="flex-1 flex items-center justify-center py-10 px-5 md:px-8 lg:p-14">
      <div className="w-full max-w-4xl bg-dark-2 rounded-3xl p-8 border border-dark-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary-500/20 rounded-xl">
            <PencilSimple size={24} className="text-primary-500" weight="bold" />
          </div>
          <h2 className="h3-bold md:h2-bold text-left">Editar Perfil</h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdate)}
            className="flex flex-col gap-6">
            {/* Profile Image */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex justify-center">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            {/* Nome e Username na mesma linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Nome</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        className="shad-input" 
                        {...field}
                        placeholder="Seu nome completo" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Nome de usuário</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="shad-input opacity-60"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input opacity-60"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Biografia</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar resize-none"
                      {...field}
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            {/* Botões */}
            <div className="flex gap-4 items-center justify-end mt-4">
              <Button
                type="button"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingUpdate}>
                {isLoadingUpdate && <Loader />}
                Atualizar Perfil
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UpdateProfile