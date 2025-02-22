"use client"

import { useState } from "react" // Removed useEffect
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { UserPlus, Envelope, Lock, Eye, EyeSlash, User, UserCircle } from "@phosphor-icons/react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries"
import { SignupValidation } from "@/lib/validation"
import { useUserContext } from "@/context/AuthContext"

const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const [showPassword, setShowPassword] = useState(false)

  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user)

      if (!newUser) {
        toast({ 
          variant: "destructive",
          title: "Erro no cadastro", 
          description: "Por favor, tente novamente" 
        })
        return
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      })

      if (!session) {
        toast({ 
          variant: "destructive",
          title: "Erro no login", 
          description: "Por favor, faça login manualmente" 
        })
        navigate("/sign-in")
        return
      }
      
      const isLoggedIn = await checkAuthUser()

      if (isLoggedIn) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao Peoplelly!",
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

  // Rest of the component remains the same...
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
              Crie sua conta
            </h2>
            <p className="text-light-3 small-medium md:base-regular text-center max-w-[300px]">
              Construa laços, compartilhe sorrisos
            </p>
          </div>

          {/* Formulário */}
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="auth-form mt-8 animate-fadeIn">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Nome completo</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input 
                        type="text" 
                        className="shad-input pl-10" 
                        {...field}
                        placeholder="Digite seu nome" 
                      />
                      <User className="input-icon" size={20} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Nome de usuário</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input 
                        type="text" 
                        className="shad-input pl-10" 
                        {...field}
                        placeholder="Digite seu nome de usuário" 
                      />
                      <UserCircle className="input-icon" size={20} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Senha */}
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

            {/* Confirmar Senha */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Confirmar senha</FormLabel>
                  <FormControl>
                    <div className="input-with-icon">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        className="shad-input pl-10 pr-10" 
                        {...field}
                        placeholder="Confirme sua senha" 
                      />
                      <Lock className="input-icon" size={20} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Botão de Cadastro */}
            <Button 
              type="submit" 
              className="shad-button_primary h-12 mt-2"
              disabled={isCreatingAccount || isSigningInUser || isUserLoading}
            >
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex-center gap-2">
                  <Loader />
                  <span>Criando conta...</span>
                </div>
              ) : (
                <div className="flex-center gap-2">
                  <UserPlus size={20} />
                  <span>Criar conta</span>
                </div>
              )}
            </Button>

            {/* Link para Login */}
            <p className="text-small-regular text-light-2 text-center">
              Já tem uma conta?{" "}
              <Link
                to="/sign-in"
                className="text-primary-500 text-small-semibold hover:underline transition-all">
                Entre agora
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </div>
  )
}

export default SignupForm