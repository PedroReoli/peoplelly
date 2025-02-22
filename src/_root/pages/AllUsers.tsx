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
    <div className="flex-1 py-8 px-4 md:px-8 lg:px-14 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho e Pesquisa */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Título */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-primary-500/10">
              <Users size={32} className="text-primary-500" weight="fill" />
            </div>
            <div>
              <h2 className="h3-bold md:h2-bold text-light-1">Comunidade</h2>
              <p className="base-medium text-light-3">
                Conecte-se com pessoas incríveis
              </p>
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="w-full max-w-3xl">
            <Input
              type="text"
              icon={<MagnifyingGlass size={24} />}
              placeholder="Encontre pessoas interessantes..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              wrapperClassName="shadow-xl"
            />
          </div>
        </div>

        {/* Lista de Usuários */}
        {isLoading ? (
          <div className="flex-center w-full h-[calc(100vh-280px)]">
            <Loader />
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="flex-center flex-col gap-6 w-full h-[calc(100vh-280px)]">
            <div className="p-8 rounded-full bg-dark-3/50 backdrop-blur-sm">
              <Users size={48} className="text-light-3" weight="light" />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <h3 className="h3-bold text-light-1">
                {termoPesquisa ? "Nenhum resultado" : "Comunidade vazia"}
              </h3>
              <p className="base-regular text-light-3">
                {termoPesquisa 
                  ? "Nenhum usuário encontrado para sua pesquisa" 
                  : "Nenhum usuário disponível no momento"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                         gap-6 md:gap-8 auto-rows-fr">
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