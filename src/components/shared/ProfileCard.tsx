import { Link } from "react-router-dom"

interface ProfileCardProps {
  id: string
  name: string
  username: string
  imageUrl: string
  isLoading?: boolean
}

const ProfileCard = ({ id, name, username, imageUrl, isLoading = false }: ProfileCardProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-dark-3 p-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-dark-4" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-dark-4" />
          <div className="h-3 w-16 animate-pulse rounded bg-dark-4" />
        </div>
      </div>
    )
  }

  return (
    <Link
      to={`/profile/${id}`}
      className="flex items-center gap-3 rounded-2xl bg-dark-3 p-4 
                transition-all hover:shadow-soft-blue group"
    >
      {/* Avatar com indicador de status */}
      <div className="relative">
        <img
          src={imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-2 
                   ring-offset-dark-3 ring-primary-500/40 group-hover:ring-primary-500"
        />
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full 
                      border-2 border-dark-3 bg-success" />
      </div>

      {/* Info do usuário */}
      <div className="flex flex-col min-w-0">
        <p className="base-bold text-light-1 truncate group-hover:text-primary-500">
          {name}
        </p>
        <p className="small-regular text-light-3 truncate">
          @{username}
        </p>
      </div>

      {/* Ícone de seta */}
      <svg
        className="h-5 w-5 text-primary-500 opacity-0 transition-all 
                 group-hover:translate-x-1 group-hover:opacity-100 ml-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  )
}

export default ProfileCard