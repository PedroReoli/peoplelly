import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { SignOut } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { useUserContext, INITIAL_USER } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import ProfileCard from "./ProfileCard"

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()
  const { mutate: signOut } = useSignOutAccount()

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    signOut()
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate("/sign-in")
  }

  return (
    <nav className="hidden md:flex flex-col justify-between h-screen bg-dark-2 w-[280px] relative">
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {/* Logo */}
        <div className="px-6 py-6">
          <div className="rounded-2xl bg-dark-3 p-4 shadow-soft-blue">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/assets/images/logo.svg"
                alt="logo"
                width={180}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="px-6 mb-8">
          <ProfileCard
            id={user.id}
            name={user.name}
            username={user.username}
            imageUrl={user.imageUrl}
            isLoading={isLoading}
          />
        </div>

        {/* Navigation Links */}
        <ul className="px-6 flex-1 space-y-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route
            const Icon = link.icon

            return (
              <li key={link.label}>
                <NavLink
                  to={link.route}
                  className={`flex items-center gap-4 rounded-xl p-5 transition-all ${
                    isActive 
                      ? "bg-primary-500 text-light-1 shadow-soft-blue" 
                      : "text-light-1 hover:bg-dark-3"
                  }`}
                >
                  <Icon 
                    size={28} 
                    weight={isActive ? "fill" : "regular"} 
                    className={isActive ? "text-light-1" : "text-primary-500"}
                  />
                  <span className="h3-bold text-[18px]">{link.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="px-6 py-6 border-t border-dark-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 rounded-xl p-5 hover:bg-red-500/10"
        >
          <SignOut 
            size={28} 
            className="text-primary-500"
          />
          <span className="h3-bold text-[18px] text-light-1">Sair</span>
        </Button>
      </div>
    </nav>
  )
}

export default LeftSidebar