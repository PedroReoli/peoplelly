import { useState } from 'react'
import { MagnifyingGlass, Users } from "@phosphor-icons/react"
import { useToast } from "@/components/ui/use-toast"
import { Loader } from "@/components/shared"
import { Input } from "@/components/ui/input"
import UserCard from "@/components/shared/UserCard"
import { useGetUsers } from "@/lib/react-query/queries"

const AllUsers = () => {
  const { toast } = useToast()
  const [termoPesquisa, setTermoPesquisa] = useState('')

  const { 
    data: usuarios, 
    isLoading, 
    isError: isErrorUsuarios 
  } = useGetUsers()

  if (isErrorUsuarios) {
    toast({ 
      title: "Erro ao carregar usuários",
      description: "Tente novamente mais tarde",
      variant: "destructive"
    })
    return null
  }

  const usuariosFiltrados = usuarios?.documents.filter((usuario) =>
    (usuario.username?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    usuario.name?.toLowerCase().includes(termoPesquisa.toLowerCase()))
  ) || []

  return (
    <div className="home-container">
      <div className="home-posts">
        {/* Cabeçalho */}
        <div className="flex items-center gap-2 w-full mb-8">
          <Users size={28} className="text-primary-500" weight="fill" />
          <h2 className="h3-bold md:h2-bold w-full">Comunidade</h2>
        </div>

        {/* Barra de Pesquisa */}
        <div className="flex w-full mb-8">
          <div className="flex-1 flex items-center gap-2 px-4 rounded-xl bg-dark-3">
            <MagnifyingGlass size={24} className="text-light-3" />
            <Input
              type="text"
              placeholder="Encontre pessoas interessantes..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="!bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-light-4"
            />
          </div>
        </div>

        {/* Lista de Usuários */}
        {isLoading ? (
          <div className="flex-center w-full h-[calc(100vh-280px)]">
            <Loader />
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="flex-center flex-col gap-4 w-full h-[calc(100vh-280px)] text-center">
            <div className="bg-dark-3 p-5 rounded-full">
              <Users size={48} className="text-light-3" weight="light" />
            </div>
            <p className="text-light-3 max-w-md">
              {termoPesquisa 
                ? "Nenhum usuário encontrado para sua pesquisa" 
                : "Nenhum usuário disponível no momento"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {usuariosFiltrados.map((usuario) => (
              <UserCard key={usuario.$id} user={usuario} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllUsers