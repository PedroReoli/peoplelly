import { useState } from "react"
import { Models } from "appwrite"
import { 
  BookmarkSimple, 
  MagnifyingGlass, 
  Clock, 
  ListBullets,
  Heart,
  Icon 
} from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader } from "@/components/shared"
import SavedPostList from "@/components/shared/SavedPostList"
import { useGetCurrentUser } from "@/lib/react-query/queries"
import useDebounce from "@/hooks/useDebounce"

interface IFilter {
  value: string
  label: string
  icon: Icon
}

interface IPost extends Models.Document {
  caption: string
  tags?: string[]
  imageUrl: string
  creator: {
    imageUrl: string
    name: string
  }
}

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser()
  const [searchValue, setSearchValue] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<IFilter>({
    value: "todos",
    label: "Todos os Salvos",
    icon: ListBullets
  })

  const debouncedSearch = useDebounce(searchValue, 500)

  const filters: IFilter[] = [
    { value: "todos", label: "Todos os Salvos", icon: ListBullets },
    { value: "recentes", label: "Salvos Recentemente", icon: Clock },
    { value: "maisCurtidos", label: "Mais Curtidos", icon: Heart },
  ]

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
        name: currentUser.name,
      },
    }))
    .reverse()

  const filteredPosts = savePosts?.filter((post: IPost) => 
    post.caption.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    post.tags?.some((tag: string) => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
  )

  return (
    <div className="flex-1 py-8 px-4 md:px-8 lg:px-14 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho e Pesquisa */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary-500/10">
              <BookmarkSimple size={32} className="text-primary-500" weight="fill" />
            </div>
            <div>
              <h2 className="h3-bold md:h2-bold text-light-1">Posts Salvos</h2>
              <p className="base-medium text-light-3">
                Sua coleção pessoal de posts favoritos
              </p>
            </div>
          </div>

          {/* Barra de Pesquisa e Filtros */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-3xl">
              <Input
                type="text"
                icon={<MagnifyingGlass size={24} />}
                placeholder="Pesquisar nos salvos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                wrapperClassName="shadow-xl"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-3 rounded-xl 
                                            bg-dark-3 text-light-1 hover:bg-dark-4 transition-colors">
                <selectedFilter.icon size={20} />
                <span className="hidden sm:inline">{selectedFilter.label}</span>
                <Clock size={16} className="text-light-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-3 border-dark-4">
                {filters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter)}
                    className={`flex items-center gap-2 text-light-1 hover:bg-dark-4
                              ${selectedFilter.value === filter.value ? 'text-primary-500' : ''}`}
                  >
                    <filter.icon size={20} />
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Lista de Posts */}
        {!currentUser ? (
          <div className="flex-center w-full h-[200px]">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-9 w-full">
            {!filteredPosts?.length ? (
              <div className="flex-center flex-col gap-4 w-full py-24">
                <div className="p-6 rounded-full bg-dark-3/50 backdrop-blur-sm">
                  <BookmarkSimple size={48} className="text-light-3" weight="light" />
                </div>
                <p className="text-light-3 text-center base-medium">
                  {searchValue 
                    ? "Nenhum post salvo encontrado" 
                    : "Nenhum post salvo ainda"}
                </p>
              </div>
            ) : (
              <SavedPostList posts={filteredPosts} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Saved