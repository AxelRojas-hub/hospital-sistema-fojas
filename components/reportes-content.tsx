"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, AlertTriangle, AlertCircle } from "lucide-react"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
}

interface Stats {
  totalPacientes: number
  totalFojas: number
  riesgoBajo: number
  riesgoMediano: number
  riesgoAlto: number
}

interface ReportesContentProps {
  user: User
  stats: Stats
}

export default function ReportesContent({ user, stats }: ReportesContentProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground mt-1">
          Estadísticas y reportes del hospital
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPacientes}</div>
            <p className="text-xs text-muted-foreground">Pacientes registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Fojas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFojas}</div>
            <p className="text-xs text-muted-foreground">Fojas médicas registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Riesgo Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.riesgoBajo}</div>
            <p className="text-xs text-muted-foreground">Operaciones de riesgo bajo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Riesgo Mediano</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.riesgoMediano}</div>
            <p className="text-xs text-muted-foreground">Operaciones de riesgo mediano</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución de Riesgo Quirúrgico</CardTitle>
            <CardDescription>Proporción de operaciones según nivel de riesgo</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{
                        width: `${stats.totalFojas ? (stats.riesgoBajo / stats.totalFojas) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    Bajo ({stats.riesgoBajo})
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4\">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-yellow-500 h-4 rounded-full"
                          style={{
                            width: `${stats.totalFojas ? (stats.riesgoMediano / stats.totalFojas) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Mediano ({stats.riesgoMediano})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-red-500 h-4 rounded-full"
                          style={{
                            width: `${stats.totalFojas ? (stats.riesgoAlto / stats.totalFojas) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        Alto ({stats.riesgoAlto})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}