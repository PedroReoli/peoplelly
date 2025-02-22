import { Models } from "appwrite"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Heart, BookmarkSimple, ChatCentered, Share } from "@phosphor-icons/react"

import { checkIsLiked } from "@/lib/utils"
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries"

type PostStatsProps = {
  post: Models.Document
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation()
  const likesList = post.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState<string[]>(likesList)
  const [isSaved, setIsSaved] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [showShareTooltip, setShowShareTooltip] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost } = useSavePost()
  const { mutate: deleteSavePost } = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let likesArray = [...likes]

    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId)
    } else {
      likesArray.push(userId)
      setIsLikeAnimating(true)
    }

    setLikes(likesArray)
    likePost({ postId: post.$id, likesArray })
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavePost(savedPostRecord.$id)
    } else {
      savePost({ userId: userId, postId: post.$id })
      setIsSaved(true)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(window.location.origin + `/posts/${post.$id}`)
      setShowShareTooltip(true)
      setTimeout(() => setShowShareTooltip(false), 2000)
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  return (
    <div className={`flex items-center justify-between z-20 mt-3 ${
      location.pathname.startsWith("/profile") ? "w-full" : ""
    }`}>
      <div className="flex items-center gap-4">
        {/* Botão de Like */}
        <button
          onClick={handleLikePost}
          className="flex items-center gap-2 rounded-full p-2 
                   transition-all duration-300 hover:bg-primary-500/10"
        >
          <Heart
            size={24}
            weight={checkIsLiked(likes, userId) ? "fill" : "regular"}
            className={`transition-all duration-300 ${
              checkIsLiked(likes, userId)
                ? "text-red-500"
                : "text-light-2 hover:text-primary-500"
            } ${isLikeAnimating ? "animate-like" : ""}`}
            onAnimationEnd={() => setIsLikeAnimating(false)}
          />
          <span className="small-medium lg:base-medium text-light-2 min-w-[20px]">
            {likes.length > 0 ? likes.length : ""}
          </span>
        </button>

        {/* Botão de Comentários */}
        <button
          className="flex items-center gap-2 rounded-full p-2 
                   transition-all duration-300 hover:bg-primary-500/10"
        >
          <ChatCentered
            size={24}
            className="text-light-2 transition-colors hover:text-primary-500"
          />
          <span className="small-medium lg:base-medium text-light-2 min-w-[20px]">
            {post.comments?.length > 0 ? post.comments.length : ""}
          </span>
        </button>

        {/* Botão de Compartilhar */}
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full p-2 
                     transition-all duration-300 hover:bg-primary-500/10"
          >
            <Share
              size={24}
              className="text-light-2 transition-colors hover:text-primary-500"
            />
          </button>
          {showShareTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 
                          bg-dark-4 text-light-2 text-xs rounded-md whitespace-nowrap
                          animate-fade-in">
              Link copiado!
            </div>
          )}
        </div>
      </div>

      {/* Botão de Salvar */}
      <button
        onClick={handleSavePost}
        className="rounded-full p-2 transition-all duration-300 hover:bg-primary-500/10"
        title={isSaved ? "Remover dos salvos" : "Salvar post"}
      >
        <BookmarkSimple
          size={24}
          weight={isSaved ? "fill" : "regular"}
          className={`transition-all duration-300 ${
            isSaved
              ? "text-primary-500"
              : "text-light-2 hover:text-primary-500"
          }`}
        />
      </button>
    </div>
  )
}

export default PostStats