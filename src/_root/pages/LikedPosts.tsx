import {  Loader } from "@/components/shared"
import SimplePostGrid from "@/components/shared/SimplePostGrid"
import { useGetCurrentUser } from "@/lib/react-query/queries"
import { Heart } from "@phosphor-icons/react"

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser()

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )

  return (
    <>
      {currentUser.liked.length === 0 ? (
        <div className="flex-center flex-col gap-4 py-10">
          <Heart size={48} className="text-light-3" weight="light" />
          <p className="text-light-3 small-medium">
            Nenhuma publicação curtida ainda
          </p>
        </div>
      ) : (
        <SimplePostGrid posts={currentUser.liked} showUser={true} />
      )}
    </>
  )
}

export default LikedPosts