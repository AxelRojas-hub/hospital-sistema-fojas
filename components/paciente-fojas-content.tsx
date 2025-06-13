"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, ArrowLeft, Edit, Eye, Ban } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { createClientClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
}

interface Paciente {
  id: string
  nombre: string
  num_historia_clinica: string
  fecha_nacimiento: string | null
  genero: string | null
  direccion: string | null
  telefono: string | null
  dni: string | null
}

interface Foja {
  id: string
  nombre_paciente: string
  num_historia_clinica: string
  fecha: string
  diagnostico_preoperatorio: string
  operacion_realizada: string
  medico_responsable: string
  medico_responsable_nombre: string
  invalida?: boolean
}

interface PacienteFojasContentProps {
  user: User
  paciente: Paciente
  fojas: Foja[]
}

export default function PacienteFojasContent({ user, paciente, fojas }: PacienteFojasContentProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const supabase = createClientClient()

  const handleToggleInvalida = async (fojaId: string, currentStatus: boolean | undefined) => {
    setLoading((prev) => ({ ...prev, [fojaId]: true }))

    try {
      const { error } = await supabase.from("fojas").update({ invalida: !currentStatus }).eq("id", fojaId)

      if (error) throw error

      // Refrescar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el estado de la foja:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [fojaId]: false }))
    }
  }

  // Determinar qué acciones puede realizar el usuario según su rol
  const canMarkInvalid = user.rol === "MedicoJefe"
  const canEdit = user.rol === "MedicoJefe" || user.rol === "Medico"
  const canCreate = user.rol === "MedicoJefe" || user.rol === "Medico"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/pacientes" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Pacientes
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Fojas de {paciente.nombre}</h1>
            <p className="text-muted-foreground mt-1">
              Historia Clínica: {paciente.num_historia_clinica} {paciente.dni ? `- DNI: ${paciente.dni}` : ""}
            </p>
          </div>
          {canCreate && (
            <Link href={`/fojas/nueva?hc=${paciente.num_historia_clinica}`}>
              <Button className="mt-4 md:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Foja
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Fojas Médicas</CardTitle>
        </CardHeader>
        <CardContent>
          {fojas.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Operación</TableHead>
                    <TableHead>Médico Responsable</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fojas.map((foja) => (
                    <TableRow key={foja.id} className={foja.invalida ? "bg-red-50" : ""}>
                      <TableCell>{format(new Date(foja.fecha), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>{foja.diagnostico_preoperatorio}</TableCell>
                      <TableCell>{foja.operacion_realizada}</TableCell>
                      <TableCell>{foja.medico_responsable_nombre}</TableCell>
                      <TableCell>
                        {foja.invalida ? (
                          <Badge variant="destructive">Inválida</Badge>
                        ) : (
                          <Badge variant="outline">Válida</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/fojas/${foja.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>

                          {canEdit && (
                            <Link href={`/fojas/${foja.id}/editar`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                            </Link>
                          )}

                          {canMarkInvalid && (
                            <Button
                              variant={foja.invalida ? "outline" : "destructive"}
                              size="sm"
                              onClick={() => handleToggleInvalida(foja.id, foja.invalida)}
                              disabled={loading[foja.id]}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              {foja.invalida ? "Validar" : "Invalidar"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Este paciente no tiene fojas médicas registradas.</p>
              {canCreate && (
                <Link href={`/fojas/nueva?hc=${paciente.num_historia_clinica}`}>
                  <Button className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Crear primera foja
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
