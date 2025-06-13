"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Eye, Ban } from "lucide-react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { createClientClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
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

interface FojasContentProps {
  user: User
  fojas: Foja[]
}

export default function FojasContent({ user, fojas }: FojasContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const supabase = createClientClient()

  const filteredFojas = fojas.filter(
    (foja) =>
      foja.nombre_paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foja.num_historia_clinica.includes(searchTerm) ||
      foja.diagnostico_preoperatorio.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Fojas Médicas</h1>
          <p className="text-muted-foreground mt-1">Gestión de historias clínicas y registros médicos</p>
        </div>
        {canCreate && (
          <Link href="/fojas/nueva">
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Foja
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Fojas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por paciente, historia clínica o diagnóstico..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Historia Clínica</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Operación</TableHead>
                  <TableHead>Médico Responsable</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFojas.length > 0 ? (
                  filteredFojas.map((foja) => (
                    <TableRow key={foja.id} className={foja.invalida ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{foja.nombre_paciente}</TableCell>
                      <TableCell>{foja.num_historia_clinica}</TableCell>
                      <TableCell>{format(parseISO(foja.fecha), "dd/MM/yyyy", { locale: es })}</TableCell>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No se encontraron fojas médicas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
