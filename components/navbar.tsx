"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClientClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface NavbarProps {
  userName: string
  userRole: string
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientClient()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const getRoleName = (rol: string) => {
    switch (rol) {
      case "MedicoJefe":
        return "Médico Jefe"
      case "Medico":
        return "Médico"
      case "Enfermero":
        return "Enfermero/a"
      case "Administrador":
        return "Administrador"
      default:
        return rol
    }
  }

  // Determinar qué elementos de navegación mostrar según el rol y la ruta actual
  const isAdmin = userRole === "Administrador"
  const isAdminRoute = pathname.startsWith("/admin")

  const navItems = isAdminRoute
    ? [
        { name: "Panel Admin", path: "/admin" },
        { name: "Usuarios", path: "/admin/usuarios" },
        { name: "Crear Usuario", path: "/admin/crear-usuario" },
      ]
    : [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Pacientes", path: "/pacientes" },
        { name: "Fojas", path: "/fojas" },
        { name: "Reportes", path: "/reportes" },
      ]

  // Si es administrador y no está en una ruta de admin, agregar enlace al panel de admin
  if (isAdmin && !isAdminRoute) {
    navItems.push({ name: "Panel Admin", path: "/admin" })
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href={isAdminRoute ? "/admin" : "/dashboard"} className="text-xl font-bold">
              Hospital Regional
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{userName}</span> ({getRoleName(userRole)})
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t mt-2">
                <div className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">{userName}</span> ({getRoleName(userRole)})
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
