import { Link, useLocation } from "react-router-dom"
import { sidebarLinks } from "@/constants"

const Bottombar = () => {
  const { pathname } = useLocation()

  return (
    <nav className="fixed bottom-0 z-50 w-full md:hidden bg-dark-2 border-t border-dark-4">
      <div className="flex items-center justify-between px-4 py-3 max-w-[520px] mx-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.route
          const Icon = link.icon

          return (
            <Link
              key={link.label}
              to={link.route}
              className="flex flex-col items-center gap-1"
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary-500 text-light-1" 
                  : "text-light-2 hover:bg-primary-500/10"
              }`}>
                <Icon 
                  size={24} 
                  weight={isActive ? "fill" : "regular"} 
                />
              </div>
              <span className={`text-[11px] ${
                isActive 
                  ? "text-primary-500 font-bold" 
                  : "text-light-2"
              }`}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Bottombar