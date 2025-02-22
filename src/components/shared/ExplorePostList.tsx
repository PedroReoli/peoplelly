import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { Heart, ChatCircle } from "@phosphor-icons/react"
import { useUserContext } from "@/context/AuthContext"
import { multiFormatDateString } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type ExplorePostListProps = {
  posts: Models.Document[]
}

const ExplorePostList = ({ posts }: ExplorePostListProps) => {
  useUserContext()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        post && post.$id ? (
          <Card 
            key={post.$id} 
            className="overflow-hidden bg-dark-2 hover:shadow-medium-blue transition-shadow duration-300"
          >
            <Link to={`/posts/${post.$id}`} className="block">
              {/* Imagem e Overlay */}
              <div className="relative aspect-square">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                              opacity-0 hover:opacity-100 transition-all duration-300
                              flex items-end justify-between p-4">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-white">
                      <Heart size={20} weight="bold" />
                      <span className="small-medium">{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <ChatCircle size={20} weight="bold" />
                      <span className="small-medium">{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                {/* Cabeçalho do Post */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt={`Foto de ${post.creator?.name}`}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="base-medium text-light-1 truncate">
                      {post.creator?.name}
                    </p>
                    <p className="subtle-semibold text-light-3">
                      {multiFormatDateString(post.$createdAt)}
                    </p>
                  </div>
                </div>

                {/* Legenda */}
                <p className="base-medium text-light-2 line-clamp-2 mb-2">
                  {post.caption}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="subtle-semibold text-primary-500 hover:text-primary-400 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </Card>
        ) : null
      ))}
    </div>
  )
}

export default ExplorePostList