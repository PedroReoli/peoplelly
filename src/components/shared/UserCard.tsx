import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TiltCard } from "@/components/ui/tilt-card"
import { useUserContext } from "@/context/AuthContext"

type UserCardProps = {
  user: Models.Document
}

const UserCard = ({ user }: UserCardProps) => {
  const { onlineUsers } = useUserContext()
  const isOnline = onlineUsers.has(user.$id)

  return (
    <TiltCard>
      <div className="flex flex-col items-center gap-6 p-6">
        <Link 
          to={`/profile/${user.$id}`} 
          className="flex flex-col items-center gap-4 w-full group"
        >
          {/* Foto do Perfil com Efeito */}
          <div className="relative">
            <div className="relative h-24 w-24 rounded-full 
                          ring-2 ring-offset-2 ring-offset-dark-2 ring-primary-500/40 
                          transition-all group-hover:ring-primary-500">
              <img
                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
              {/* Indicador Online/Offline */}
              <span 
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full 
                           border-2 border-dark-2 transition-colors
                           ${isOnline ? 'bg-success' : 'bg-gray-500'}`}
                title={isOnline ? 'Online' : 'Offline'}
              />
            </div>
            
            {/* Efeito de Brilho */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 
                          rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity" />
          </div>

          {/* Informações do Usuário */}
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center gap-2">
              <p className="base-bold text-light-1 line-clamp-1">
                {user.name}
              </p>
              {isOnline && (
                <span className="text-xs text-success">• Online</span>
              )}
            </div>
            <p className="small-regular text-light-3 line-clamp-1">
              @{user.username}
            </p>
          </div>
        </Link>

        {/* Bio do Usuário (se existir) */}
        {user.bio && (
          <p className="small-medium text-light-2 text-center line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Botão de Seguir */}
        <Button 
          type="button" 
          className="shad-button_primary w-full"
          size="lg"
        >
          Seguir
        </Button>
      </div>
    </TiltCard>
  )
}

export default UserCard