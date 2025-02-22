import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom"
import { 
  PencilSimple, 
  Heart, 
  ImageSquare, 
  UserCircle,
  Users
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { LikedPosts } from "@/_root/pages"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById } from "@/lib/react-query/queries"
import SimplePostGrid from "@/components/shared/SimplePostGrid"
import { Loader } from "@/components/shared"

interface StatBlockProps {
  value: string | number
  label: string
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
)

const Profile = () => {
  const { id } = useParams()
  const { user } = useUserContext()
  const { pathname } = useLocation()

  const { data: currentUser } = useGetUserById(id || "")

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )

  return (
    <div className="flex flex-col items-center py-8 px-4 md:px-8 lg:px-14 gap-8 max-w-7xl mx-auto w-full">
      <div className="w-full max-w-5xl bg-dark-2 rounded-2xl p-8">
        <div className="flex xl:flex-row flex-col max-xl:items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            {currentUser.imageUrl ? (
              <img
                src={currentUser.imageUrl || "/placeholder.svg"}
                alt="perfil"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover border-4 border-primary-500"
              />
            ) : (
              <div className="w-28 h-28 lg:h-36 lg:w-36 rounded-full bg-dark-4 flex-center">
                <UserCircle size={64} className="text-light-3" weight="light" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-6 items-center justify-center xl:justify-start flex-wrap">
              <StatBlock value={currentUser.posts.length} label="Publicações" />
              <StatBlock value={20} label="Seguidores" />
              <StatBlock value={20} label="Seguindo" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-6 max-w-screen-sm">
              {currentUser.bio || "Sem biografia"}
            </p>

            {/* Botões */}
            <div className="flex justify-center xl:justify-start gap-4 mt-6">
              {user.id === currentUser.$id ? (
                <Link
                  to={`/update-profile/${currentUser.$id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-3 text-light-1 hover:bg-dark-4 transition-colors">
                  <PencilSimple size={20} />
                  <span className="small-medium">Editar Perfil</span>
                </Link>
              ) : (
                <Button type="button" className="shad-button_primary px-8">
                  <Users size={20} className="mr-2" />
                  Seguir
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {currentUser.$id === user.id && (
        <div className="flex w-full max-w-5xl bg-dark-2 rounded-xl">
          <Link
            to={`/profile/${id}`}
            className={`flex items-center gap-2 flex-1 p-4 justify-center rounded-l-xl transition-colors
              ${pathname === `/profile/${id}` 
                ? 'bg-primary-500 text-light-1' 
                : 'hover:bg-dark-3 text-light-2'}`}>
            <ImageSquare size={20} />
            Publicações
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`flex items-center gap-2 flex-1 p-4 justify-center rounded-r-xl transition-colors
              ${pathname === `/profile/${id}/liked-posts` 
                ? 'bg-primary-500 text-light-1' 
                : 'hover:bg-dark-3 text-light-2'}`}>
            <Heart size={20} />
            Curtidas
          </Link>
        </div>
      )}

      {/* Posts Grid */}
      <div className="w-full max-w-5xl">
        <Routes>
          <Route
            index
            element={<SimplePostGrid posts={currentUser.posts} />}
          />
          {currentUser.$id === user.id && (
            <Route path="/liked-posts" element={<LikedPosts />} />
          )}
        </Routes>
        <Outlet />
      </div>
    </div>
  )
}

export default Profile