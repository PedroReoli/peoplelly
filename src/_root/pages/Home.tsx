import { Models } from "appwrite"
import { Lightning, WarningCircle, SmileySad } from "@phosphor-icons/react"

import { Loader } from "@/components/shared"
import PostCard from "@/components/shared/PostCard"
import { useGetRecentPosts } from "@/lib/react-query/queries"

const Home = () => {
  const {
    data: posts,
    isLoading: carregandoPosts,
    isError: erroPosts,
  } = useGetRecentPosts()

  // Componente de erro reutilizável
  const ErrorMessage = () => (
    <div className="flex-center flex-col gap-4 w-full max-w-3xl mx-auto p-8 rounded-2xl bg-dark-2 border border-dark-4">
      <WarningCircle size={32} className="text-error" weight="light" />
      <p className="text-light-1 text-center">
        Ops! Algo deu errado ao carregar o conteúdo.
        <br />
        <span className="text-light-3 text-sm">
          Por favor, tente novamente mais tarde.
        </span>
      </p>
    </div>
  )

  if (erroPosts) {
    return (
      <div className="flex-center w-full h-[calc(100vh-120px)]">
        <ErrorMessage />
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 items-center w-full max-w-4xl mx-auto px-4 md:px-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 self-start mb-8">
        <Lightning size={32} className="text-primary-500" weight="fill" />
        <h1 className="h2-bold">Feed </h1>
      </div>

      {/* Conteúdo Principal */}
      <div className="w-full">
        {carregandoPosts ? (
          // Estado de Loading
          <div className="flex-center w-full h-[calc(100vh-200px)]">
            <Loader />
          </div>
        ) : posts?.documents.length === 0 ? (
          // Estado vazio
          <div className="flex-center flex-col gap-4 w-full p-8 rounded-2xl bg-dark-2 border border-dark-4">
            <SmileySad size={48} className="text-light-3" weight="light" />
            <p className="text-light-3 text-center">
              Nenhuma publicação encontrada
              <br />
              <span className="text-sm">
                Seja o primeiro a compartilhar algo incrível!
              </span>
            </p>
          </div>
        ) : (
          // Lista de Posts
          <ul className="flex flex-col gap-8 w-full pb-10">
            {posts?.documents.map((post: Models.Document) => (
              <li 
                key={post.$id} 
                className="w-full transition-transform hover:scale-[1.02]"
              >
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home