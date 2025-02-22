import { Models } from "appwrite"
import { Link } from "react-router-dom"
import { PencilSimple } from "@phosphor-icons/react"

import PostStats from "@/components/shared/PostStats"
import { multiFormatDateString } from "@/lib/utils"
import { useUserContext } from "@/context/AuthContext"

type PostCardProps = {
  post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
  const { user, onlineUsers } = useUserContext() // Adicionado onlineUsers
  const isCreatorOnline = onlineUsers.has(post.creator.$id) // Verifica se o criador está online

  if (!post.creator) return null

  return (
    <div className="post-card group">
      {/* Cabeçalho do Post */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Link 
            to={`/profile/${post.creator.$id}`}
            className="relative shrink-0"
          >
            <img
              src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt={`Foto de ${post.creator.name}`}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 
                       ring-offset-dark-2 ring-primary-500/40 transition-all 
                       group-hover:ring-primary-500"
            />
            {/* Status online/offline */}
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full 
                         border-2 border-dark-2 transition-colors
                         ${isCreatorOnline ? 'bg-success' : 'bg-gray-500'}`}
              title={isCreatorOnline ? 'Online' : 'Offline'} 
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="base-medium lg:body-bold text-light-1 line-clamp-1">
                {post.creator.name}
              </p>
              {/* Indicador textual de online */}
              {isCreatorOnline && (
                <span className="text-xs text-success">• Online</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location || "Localização não informada"}
              </p>
            </div>
          </div>
        </div>

        {user.id === post.creator.$id && (
          <Link
            to={`/update-post/${post.$id}`}
            className="rounded-full p-2 transition-colors hover:bg-dark-3"
          >
            <PencilSimple 
              size={20}
              weight="bold" 
              className="text-light-2 transition-colors hover:text-primary-500"
            />
          </Link>
        )}
      </div>

      {/* Conteúdo do Post */}
      <Link to={`/posts/${post.$id}`} className="flex-1">
        <div className="py-5">
          <p className="small-medium lg:base-medium text-light-1">
            {post.caption}
          </p>
          {post.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: string) => (
                <li 
                  key={`${tag}${index}`}
                  className="small-regular text-light-3 hover:text-primary-500 transition-colors"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="Imagem do post"
          className="post-card_img transition-transform group-hover:scale-[1.01]"
        />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard