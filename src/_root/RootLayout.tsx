import { Outlet } from "react-router-dom"
import Topbar from "@/components/shared/Topbar"
import Bottombar from "@/components/shared/Bottombar"
import LeftSidebar from "@/components/shared/LeftSidebar"

const RootLayout = () => {
  return (
    <div className="w-full h-screen flex bg-dark-1">
      {/* Sidebar - Visível apenas em desktop */}
      <LeftSidebar />
      
      {/* Container Principal */}
      <div className="flex flex-1 flex-col h-full">
        {/* Topbar - Visível apenas em mobile */}
        <Topbar />
        
        {/* Área de Conteúdo Principal */}
        <main className="flex-1 h-full overflow-y-auto">
          <div className="w-full h-full md:px-6 md:py-6 px-4 pb-24 md:pb-6 pt-20 md:pt-6">
            <Outlet />
          </div>
        </main>
        
        {/* Bottombar - Visível apenas em mobile */}
        <Bottombar />
      </div>
    </div>
  )
}

export default RootLayout