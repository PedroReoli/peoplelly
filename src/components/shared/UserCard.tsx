import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"

type UserCardProps = {
  user: Models.Document
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl bg-dark-2 border border-dark-4 p-6 hover:shadow-medium-blue transition-all">
      <Link 
        to={`/profile/${user.$id}`} 
        className="flex flex-col items-center gap-4 w-full"
      >
        {/* Foto do Perfil */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-pulse" />
          <div className="absolute inset-[2px] rounded-full overflow-hidden">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Informações do Usuário */}
        <div className="flex flex-col items-center gap-1">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          <p className="small-regular text-light-3 text-center line-clamp-1">
            @{user.username}
          </p>
        </div>
      </Link>

      {/* Botão de Seguir */}
      <Button 
        type="button" 
        className="shad-button_primary w-full"
        size="lg"
      >
        Seguir
      </Button>
    </div>
  )
}

export default UserCard