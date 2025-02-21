import { 
  House,
  UsersThree,
  Image,
  BookmarkSimple,
  Plus
} from "@phosphor-icons/react"

export const sidebarLinks = [
  {
    icon: House,
    route: "/",
    label: "Início",
  },
  {
    icon: UsersThree,
    route: "/all-users",
    label: "Usuários",
  },
  {
    icon: Image,
    route: "/explore",
    label: "Explorar",
  },
  {
    icon: BookmarkSimple,
    route: "/saved",
    label: "Salvos",
  },
  {
    icon: Plus,
    route: "/create-post",
    label: "Postar",
  },
]

export const bottombarLinks = [
  {
    icon: House,
    route: "/",
    label: "Início",
  },
  {
    icon: UsersThree,
    route: "/all-users",
    label: "People",
  },
  {
    icon: Image,
    route: "/explore",
    label: "Explorar",
  },
  {
    icon: BookmarkSimple,
    route: "/saved",
    label: "Salvos",
  },
  {
    icon: Plus,
    route: "/create-post",
    label: "Postar",
  },
]