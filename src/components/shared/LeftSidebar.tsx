import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { SignOut } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { useSignOutAccount } from "@/lib/react-query/queries"
import { useUserContext, INITIAL_USER } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import Loader from "./Loader"

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
    <nav className="leftsidebar">
      <div className="flex-1">
        {/* Logo com Card */}
        <div className="mx-6 mt-6 mb-8">
          <div className="rounded-2xl bg-dark-3 p-4 shadow-soft-blue">
            <Link to="/" className="flex items-center justify-center">
              <img
                src="/assets/icons/logo-form.svg"
                alt="logo"
                width={180}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Perfil Card */}
        {isLoading ? (
          <div className="px-8 py-6">
            <Loader />
          </div>
        ) : (
          <Link
            to={`/profile/${user.id}`}
            className="mx-6 mb-10 flex items-center gap-4 rounded-2xl bg-dark-3 p-5 transition-all hover:shadow-soft-blue"
          >
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="h3-bold text-light-1">{user.name}</p>
              <p className="base-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

        {/* Navigation Links */}
        <ul className="px-6">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route
            const Icon = link.icon

            return (
              <li key={link.label} className="mb-4">
                <NavLink
                  to={link.route}
                  className={`flex items-center gap-4 rounded-xl p-5 transition-all ${
                    isActive 
                      ? "bg-primary-500 text-light-1 shadow-soft-blue" 
                      : "text-light-1 hover:bg-dark-3"
                  }`}
                >
                  <Icon 
                    size={26} 
                    weight={isActive ? "fill" : "regular"} 
                    className={isActive ? "text-light-1" : "text-primary-500"}
                  />
                  <span className="h3-bold">{link.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Logout Button */}
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="mx-6 mb-8 flex items-center gap-4 rounded-xl p-5 hover:bg-red-500/10"
      >
        <SignOut 
          size={26} 
          className="text-primary-500"
        />
        <span className="h3-bold text-light-1">Sair</span>
      </Button>
    </nav>
  )
}

export default LeftSidebar