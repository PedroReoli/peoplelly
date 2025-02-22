import { Outlet, Navigate, useLocation } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false
  const location = useLocation()

  // Verifica se está na página de reset de senha
  const isResetPasswordPage = location.pathname.startsWith('/reset-password')

  // Se estiver autenticado E não estiver na página de reset, redireciona para home
  if (isAuthenticated && !isResetPasswordPage) {
    return <Navigate to="/" />
  }

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>

      <img
        src="/assets/images/side-img.svg"
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </>
  )
}

export default AuthLayout