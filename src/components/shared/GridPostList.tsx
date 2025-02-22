import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { Heart, ChatCircle } from "@phosphor-icons/react"
import PostStats from "@/components/shared/PostStats"
import { useUserContext } from "@/context/AuthContext"
import { multiFormatDateString } from "@/lib/utils"

type GridPostListProps = {
  posts: Models.Document[]
  showUser?: boolean
  showStats?: boolean
}

const GridPostList = ({ 
  posts, 
  showUser = true, 
  showStats = true 
}: GridPostListProps) => {
  const { user } = useUserContext()

  if (!posts || posts.length === 0) {
    return (
      <div className="flex-center flex-col gap-4 w-full py-24">
        <p className="text-light-4 text-center">
          Nenhum post encontrado
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {posts.map((post) => (
        post && post.imageUrl ? (
          <li key={post.$id} className="relative group">
            <Link 
              to={`/posts/${post.$id}`} 
              className="block relative aspect-square rounded-2xl overflow-hidden"
            >
              {/* Imagem do Post */}
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform 
                         group-hover:scale-105"
              />

              {/* Overlay com Estatísticas */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                            transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Heart size={24} weight="fill" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <ChatCircle size={24} weight="fill" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </Link>

            {/* Informações do Post */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t 
                          from-black/80 to-transparent">
              {showUser && post.creator && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt={`Foto de ${post.creator.name}`}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                  />
                  <div>
                    <p className="text-white text-sm font-medium line-clamp-1">
                      {post.creator.name}
                    </p>
                    <p className="text-light-3 text-xs">
                      {multiFormatDateString(post.$createdAt)}
                    </p>
                  </div>
                </div>
              )}
              
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        ) : null
      ))}
    </ul>
  )
}

export default GridPostList