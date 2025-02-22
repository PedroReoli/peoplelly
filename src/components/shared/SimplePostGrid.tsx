import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { Heart, Image } from "@phosphor-icons/react"
import { multiFormatDateString } from "@/lib/utils"

type SimplePostGridProps = {
  posts: Models.Document[]
  showUser?: boolean
}

const SimplePostGrid = ({ 
  posts, 
  showUser = true
}: SimplePostGridProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex-center flex-col gap-4 py-10">
        <Image size={48} weight="thin" className="text-light-3" />
        <p className="text-light-3 body-medium">Nenhuma publicação encontrada</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        post && post.imageUrl ? (
          <Link 
            key={post.$id} 
            to={`/posts/${post.$id}`}
            className="group"
          >
            <article className="bg-dark-2 rounded-3xl overflow-hidden border border-dark-4 hover:border-primary-500 transition-all duration-300">
              {/* Container da Imagem */}
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay com likes */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white">
                    <Heart 
                      size={24} 
                      weight={post.likes?.length > 0 ? "fill" : "regular"}
                      className={post.likes?.length > 0 ? "text-primary-500" : "text-white"}
                    />
                    <span className="font-medium">{post.likes?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Informações do Post */}
              {showUser && post.creator && (
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                      alt={`Foto de ${post.creator.name}`}
                      className="w-10 h-10 rounded-full object-cover border border-dark-4"
                    />
                    <div className="flex-1">
                      <p className="base-medium text-light-1 line-clamp-1">
                        {post.creator.name}
                      </p>
                      <p className="subtle-semibold text-light-3">
                        {multiFormatDateString(post.$createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  {post.caption && (
                    <p className="text-light-2 small-medium line-clamp-2 mt-4">
                      {post.caption}
                    </p>
                  )}
                </div>
              )}
            </article>
          </Link>
        ) : null
      ))}
    </div>
  )
}

export default SimplePostGrid