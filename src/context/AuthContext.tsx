import { useNavigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

import { IUser } from "@/types"
import { getCurrentUser, updateUserOnlineStatus } from "@/lib/appwrite/api"

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  isOnline: false,
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  onlineUsers: new Set<string>(),
}

type IContextType = {
  user: IUser
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
  onlineUsers: Set<string>
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  const checkAuthUser = async () => {
    setIsLoading(true)
    try {
      const currentAccount = await getCurrentUser()
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          isOnline: true,
        })
        setIsAuthenticated(true)
        
        // Atualiza status online
        if (currentAccount.$id) {
          setOnlineUsers(prev => new Set(prev).add(currentAccount.$id))
          await updateUserOnlineStatus(currentAccount.$id, true)
        }

        return true
      }

      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza status online
  useEffect(() => {
    if (user.id) {
      const handleOnlineStatus = async () => {
        setOnlineUsers(prev => new Set(prev).add(user.id))
        await updateUserOnlineStatus(user.id, true)
      }

      const handleOfflineStatus = async () => {
        await updateUserOnlineStatus(user.id, false)
        setOnlineUsers(prev => {
          const next = new Set(prev)
          next.delete(user.id)
          return next
        })
      }

      // Atualiza quando o usuário fica online
      handleOnlineStatus()

      // Atualiza quando o usuário fica offline
      window.addEventListener('beforeunload', handleOfflineStatus)
      
      return () => {
        window.removeEventListener('beforeunload', handleOfflineStatus)
        handleOfflineStatus()
      }
    }
  }, [user.id])

  // Verifica autenticação
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback")
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in")
    }

    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    onlineUsers,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useUserContext = () => useContext(AuthContext)