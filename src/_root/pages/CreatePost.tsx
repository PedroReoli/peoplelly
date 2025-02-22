import PostForm from "@/components/forms/PostForm"
import { NotePencil } from "@phosphor-icons/react"

const CreatePost = () => {
  return (
    <div className="flex-1 py-8 px-4 md:px-8 lg:px-14 h-screen flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-primary-500/10">
            <NotePencil size={32} className="text-primary-500" weight="fill" />
          </div>
          <div>
            <h2 className="h3-bold md:h2-bold text-light-1">Criar Post</h2>
            <p className="base-medium text-light-3">
              Compartilhe seus momentos especiais
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-dark-2 rounded-xl border border-dark-4 flex-1 overflow-hidden">
          <PostForm action="Create" />
        </div>
      </div>
    </div>
  )
}

export default CreatePost