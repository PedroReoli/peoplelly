"use client"

import { useState } from "react" // Removed useEffect
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { SignIn, Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { SigninValidation } from "@/lib/validation"
import { useSignInAccount } from "@/lib/react-query/queries"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const [showPassword, setShowPassword] = useState(false)

  const { mutateAsync: signInAccount, isLoading } = useSignInAccount()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const session = await signInAccount(user)

      if (!session) {
        form.setError("email", { 
          type: "manual", 
          message: "Email ou senha incorretos" 
        })
        form.setError("password", { 
          type: "manual", 
          message: "Verifique suas credenciais" 
        })

        toast({ 
          variant: "destructive",
          title: "Erro no login", 
          description: "Verifique suas credenciais e tente novamente" 
        })
        return
      }
      
      const isLoggedIn = await checkAuthUser()

      if (isLoggedIn) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta!",
          className: "bg-primary-500 text-white",
        })
        form.reset()
        navigate("/")
      }
    } catch (error) {
      console.error(error)
      toast({ 
        variant: "destructive",
        title: "Erro no servidor", 
        description: "Tente novamente mais tarde" 
      })
    }
  }

  return (
    <div className="auth-container">
      <Form {...form}>
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
              Bem-vindo de volta!
            </h2>
            <p className="text-light-3 small-medium md:base-regular text-center max-w-[300px]">
              Entre com sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form
            onSubmit={form.handleSubmit(handleSignin)}
            className="auth-form mt-8 animate-fadeIn">
            {/* Campo de Email */}
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

            {/* Campo de Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Senha</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        className="shad-input pl-10 pr-10" 
                        {...field}
                        placeholder="Digite sua senha" 
                      />
                      <Lock className="input-icon" size={20} />
                      <button
                        type="button"
                        className="input-action-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeSlash size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Botão de Login */}
            <Button 
              type="submit" 
              className="shad-button_primary h-12 mt-2"
              disabled={isLoading || isUserLoading}
            >
              {isLoading || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> 
                  <span>Entrando...</span>
                </div>
              ) : (
                <div className="flex-center gap-2">
                  <SignIn size={20} />
                  <span>Entrar</span>
                </div>
              )}
            </Button>

            {/* Links */}
            <div className="flex flex-col gap-2 text-center">
              <p className="text-small-regular text-light-2">
                Não tem uma conta?{" "}
                <Link
                  to="/sign-up"
                  className="text-primary-500 text-small-semibold hover:underline transition-all">
                  Cadastre-se agora
                </Link>
              </p>

              <Link
                to="/forgot-password"
                className="text-primary-500 text-small-semibold hover:underline transition-all"
              >
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
        </div>
      </Form>
    </div>
  )
}

export default SigninForm