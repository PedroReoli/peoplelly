import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { 
  MagnifyingGlass, 
  Images, 
  CaretDown,
  Clock,
  Heart,
  ListBullets
} from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useDebounce from "@/hooks/useDebounce"
import { Loader } from "@/components/shared"
import ExplorePostList from "@/components/shared/ExplorePostList"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries"
import { getPostsByFilter } from "@/lib/appwrite/api"

const Explore = () => {
  const { ref, inView } = useInView()
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

  const [searchValue, setSearchValue] = useState("")
  const [selectedFilter, setSelectedFilter] = useState({
    value: "todos",
    label: "Todos os Posts",
    icon: ListBullets
  })
  const [filteredPosts, setFilteredPosts] = useState<any>(null)
  const [isLoadingFilter, setIsLoadingFilter] = useState(false)

  const debouncedSearch = useDebounce(searchValue, 500)
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)

  const filters = [
    { value: "todos", label: "Todos os Posts", icon: ListBullets },
    { value: "recentes", label: "Mais Recentes", icon: Clock },
    { value: "maisCurtidos", label: "Mais Curtidos", icon: Heart },
  ]

  useEffect(() => {
    if (inView && !searchValue && !filteredPosts) {
      fetchNextPage()
    }
  }, [inView, searchValue])

  const handleFilterChange = async (filter: typeof filters[0]) => {
    setIsLoadingFilter(true)
    setSelectedFilter(filter)
    
    try {
      const filteredResults = await getPostsByFilter(filter.value)
      setFilteredPosts(filteredResults)
    } catch (error) {
      console.error("Erro ao filtrar posts:", error)
    } finally {
      setIsLoadingFilter(false)
    }
  }

  const renderPosts = () => {
    if (isLoadingFilter) {
      return (
        <div className="flex-center w-full py-24">
          <Loader />
        </div>
      )
    }

    if (searchValue !== "") {
      if (isSearchFetching) {
        return (
          <div className="flex-center w-full py-24">
            <Loader />
          </div>
        )
      }

      return <ExplorePostList posts={searchedPosts?.documents || []} />
    }

    if (filteredPosts) {
      return <ExplorePostList posts={filteredPosts.documents || []} />
    }

    return posts?.pages.map((page) => (
      <ExplorePostList key={page.id} posts={page.documents} />
    ))
  }

  return (
    <div className="flex-1 py-8 px-4 md:px-8 lg:px-14 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho e Pesquisa */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary-500/10">
              <Images size={32} className="text-primary-500" weight="fill" />
            </div>
            <div>
              <h2 className="h3-bold md:h2-bold text-light-1">Explorar</h2>
              <p className="base-medium text-light-3">
                Descubra posts incríveis da comunidade
              </p>
            </div>
          </div>

          {/* Barra de Pesquisa e Filtros */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 max-w-3xl">
              <Input
                type="text"
                icon={<MagnifyingGlass size={24} />}
                placeholder="Pesquisar posts..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                  setFilteredPosts(null)
                  setSelectedFilter(filters[0])
                }}
                wrapperClassName="shadow-xl"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-3 rounded-xl 
                                            bg-dark-3 text-light-1 hover:bg-dark-4 transition-colors">
                <selectedFilter.icon size={20} />
                <span className="hidden sm:inline">{selectedFilter.label}</span>
                <CaretDown size={16} className="text-light-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-dark-3 border-dark-4">
                {filters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleFilterChange(filter)}
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
        {renderPosts()}

        {/* Loader de "Carregar Mais" */}
        {hasNextPage && !searchValue && !filteredPosts && (
          <div ref={ref} className="flex-center w-full py-8">
            <Loader />
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore