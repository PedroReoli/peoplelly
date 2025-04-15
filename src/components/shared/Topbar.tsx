import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { SignOut, User } from "@phosphor-icons/react"
import { Button } from "../ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queries"

const Topbar = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()

  useEffect(() => {
    if (isSuccess) navigate(0)
  }, [isSuccess, navigate])

  return (
    <header className="fixed top-0 z-50 w-full md:hidden bg-dark-2">
      <div className="flex items-center justify-between p-4">
        {/* Logo com Card */}
        <div className="flex-shrink-0">
          <div className="bg-dark-3 rounded-xl p-2.5 shadow-soft-blue transition-shadow hover:shadow-medium-blue">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/assets/images/logo.svg"
                alt="logo"
                className="h-8 w-auto object-contain min-w-[120px]"
              />
            </Link>
          </div>
        </div>

        {/* Ações do Usuário */}
        <div className="flex items-center gap-4">
          {/* Botão de Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-11 w-11 rounded-xl hover:bg-dark-4 transition-colors"
          >
            <SignOut 
              size={24} 
              weight="bold" 
              className="text-primary-500 transition-transform hover:scale-110" 
            />
          </Button>
          
          {/* Foto do Perfil */}
          <Link 
            to={`/profile/${user.id}`} 
            className="flex-shrink-0 transition-transform hover:scale-105"
          >
            <div className="relative h-11 w-11">
              <div className="absolute inset-0 rounded-full bg-primary-500 animate-pulse" />
              <div className="absolute inset-[2px] rounded-full overflow-hidden bg-dark-3 flex items-center justify-center">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl || "/placeholder.svg"}
                    alt="Perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User 
                    size={22} 
                    weight="fill" 
                    className="text-primary-500" 
                  />
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Borda inferior com gradiente */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
    </header>
  )
}

export default Topbar