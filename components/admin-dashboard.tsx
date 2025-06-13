"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
  email: string
}

interface AdminDashboardProps {
  user: User
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    // flex flex - col items - center justify - center h - [80vh]
    <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center h-[80vh]">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Bienvenido/a, <span className="font-medium">{user.nombre}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/admin/usuarios" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl">Gestión de Usuarios</CardTitle>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mt-4">
                Administra los usuarios del sistema. Visualiza, edita y deshabilita cuentas de usuario. Elimina usuarios
                deshabilitados y gestiona los permisos de acceso al sistema.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/crear-usuario" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl">Crear Usuario</CardTitle>
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mt-4">
                Crea nuevos usuarios para el sistema. Asigna roles y permisos a los nuevos usuarios. Configura médicos,
                enfermeros y administradores según las necesidades del hospital.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
