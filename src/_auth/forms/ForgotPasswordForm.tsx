"use client"

import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "react-router-dom"
import { Envelope, ArrowLeft } from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { account } from "@/lib/appwrite/config"

const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

const ForgotPasswordForm = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const handleForgotPassword = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    try {
      setIsLoading(true)

      // URL para a página de reset de senha
      const resetUrl = `${window.location.origin}/reset-password`

      // Criar recuperação de senha no Appwrite
      await account.createRecovery(
        data.email,
        resetUrl
      )

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
        className: "bg-primary-500 text-white",
        duration: 5000,
      })

      form.reset()

    } catch (error: any) {
      console.error("Appwrite error:", error)
      
      let errorMessage = "Verifique se o email está correto e tente novamente."
      
      if (error?.code === 404) {
        errorMessage = "Email não encontrado em nossa base."
      } else if (error?.code === 429) {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente."
      }

      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-center min-h-screen w-full bg-dark-1">
      <div className="auth-card">
        {/* Logo */}
        <img 
          src="/assets/icons/logo-form.svg" 
          alt="logo" 
          className="w-48 md:w-64 mb-8 animate-fadeIn" 
        />

        {/* Cabeçalho */}
        <div className="flex flex-col items-center gap-2 animate-fadeIn">
          <h2 className="h3-bold md:h2-bold text-center">
            Recuperar Senha
          </h2>
          <p className="text-light-3 small-medium md:base-regular text-center max-w-[300px]">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        {/* Formulário */}
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleForgotPassword)} 
            className="flex flex-col gap-5 w-full mt-4 min-w-[300px]"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input
                        type="email"
                        className="shad-input pl-10"
                        {...field}
                        placeholder="Digite seu email"
                      />
                      <Envelope className="input-icon" size={20} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="shad-button_primary h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader />
                  <span>Enviando...</span>
                </div>
              ) : (
                "Enviar email de recuperação"
              )}
            </Button>

            <Link
              to="/sign-in"
              className="flex items-center gap-2 text-primary-500 text-small-semibold hover:underline"
            >
              <ArrowLeft size={20} />
              <span>Voltar para o login</span>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPasswordForm