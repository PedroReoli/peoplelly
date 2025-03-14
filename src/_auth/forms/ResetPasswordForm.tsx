"use client"

import { useState, useEffect } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Lock, Eye, EyeSlash } from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { account } from "@/lib/appwrite/config"
import { useSignInAccount } from "@/lib/react-query/queries"

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

const ResetPasswordForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [recoveryData, setRecoveryData] = useState<{ userId: string; secret: string } | null>(null)

  useSignInAccount()

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Validar parâmetros da URL quando o componente montar
  useEffect(() => {
    const userId = searchParams.get("userId")
    const secret = searchParams.get("secret")
    
    console.log("URL Params:", { userId, secret }) // Debug

    if (!userId || !secret) {
      console.log("Parâmetros inválidos ou ausentes") // Debug
      toast({
        variant: "destructive",
        title: "Link inválido",
        description: "O link de recuperação é inválido ou expirou.",
        duration: 5000,
      })
      navigate("/forgot-password")
      return
    }

    setRecoveryData({ userId, secret })
  }, [searchParams, navigate, toast])

  const handleResetPassword = async (data: z.infer<typeof ResetPasswordSchema>) => {
    if (!recoveryData) {
      console.log("Dados de recuperação ausentes") // Debug
      return
    }

    try {
      setIsLoading(true)
      console.log("Iniciando reset de senha...", { ...recoveryData }) // Debug

      // Atualizar a senha usando o userId e secret da URL
      await account.updateRecovery(
        recoveryData.userId,
        recoveryData.secret,
        data.password,
        data.confirmPassword
      )

      console.log("Senha atualizada com sucesso") // Debug

      toast({
        title: "Senha alterada com sucesso!",
        description: "Redirecionando para o login...",
        className: "bg-primary-500 text-white",
        duration: 3000,
      })

      // Limpar o formulário
      form.reset()

      // Redirecionar para login após delay
      setTimeout(() => {
        navigate("/sign-in")
      }, 3000)

    } catch (error: any) {
      console.error("Erro ao redefinir senha:", error) // Debug
      
      let errorMessage = "Não foi possível alterar sua senha. Solicite um novo link."
      
      if (error?.code === 401) {
        errorMessage = "Link de recuperação expirado ou inválido."
      } else if (error?.code === 429) {
        errorMessage = "Muitas tentativas. Aguarde alguns minutos e tente novamente."
      } else if (error?.type === 'user_invalid_token') {
        errorMessage = "Token de recuperação inválido."
      }

      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: errorMessage,
        duration: 5000,
      })

      // Se o token expirou, redireciona para solicitar novo link
      if (error?.code === 401) {
        setTimeout(() => {
          navigate("/forgot-password")
        }, 3000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Não renderizar nada se não tiver os dados de recuperação
  if (!recoveryData) {
    return null
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
            Redefinir Senha
          </h2>
          <p className="text-light-3 small-medium md:base-regular text-center max-w-[300px]">
            Digite sua nova senha
          </p>
        </div>

        {/* Formulário */}
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleResetPassword)} 
            className="flex flex-col gap-5 w-full mt-4 min-w-[300px]"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Nova senha</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="shad-input pl-10 pr-10"
                        {...field}
                        placeholder="Digite sua nova senha"
                      />
                      <Lock className="input-icon" size={20} />
                      <button
                        type="button"
                        className="input-action-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Confirmar nova senha</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="shad-input pl-10"
                        {...field}
                        placeholder="Confirme sua nova senha"
                      />
                      <Lock className="input-icon" size={20} />
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
                  <span>Alterando senha...</span>
                </div>
              ) : (
                "Alterar senha"
              )}
            </Button>

            <Link
              to="/forgot-password"
              className="flex items-center justify-center text-primary-500 text-small-semibold hover:underline"
            >
              Solicitar novo link
            </Link>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResetPasswordForm