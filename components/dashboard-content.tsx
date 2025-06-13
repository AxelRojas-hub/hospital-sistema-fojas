"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, BarChart3 } from "lucide-react"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
  email: string
}

interface DashboardContentProps {
  user: User
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const getRoleName = (rol: string) => {
    switch (rol) {
      case "MedicoJefe":
        return "Médico Jefe"
      case "Medico":
        return "Médico"
      case "Enfermero":
        return "Enfermero/a"
      default:
        return rol
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Bienvenido/a, {user.nombre}</h1>
        <p className="text-muted-foreground">
          Rol: <span className="font-medium">{getRoleName(user.rol)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/pacientes" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Pacientes</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gestión de pacientes del hospital. Consulte y administre la información de los pacientes.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/fojas" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Fojas</CardTitle>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Historias clínicas y registros médicos. Cree y consulte fojas médicas de los pacientes.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/reportes" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl">Reportes</CardTitle>
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Estadísticas y reportes del hospital. Visualice datos y genere informes.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
