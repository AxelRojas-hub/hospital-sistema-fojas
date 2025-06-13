"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, FileText, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import PacienteModal from "@/components/paciente-modal"
import NuevoPacienteModal from "@/components/nuevo-paciente-modal"

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

interface PacientesContentProps {
  user: User
  pacientes: Paciente[]
  fojasCount: Record<string, number>
}

export default function PacientesContent({ user, pacientes, fojasCount }: PacientesContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isNuevoModalOpen, setIsNuevoModalOpen] = useState(false)

  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.num_historia_clinica.includes(searchTerm) ||
      (paciente.dni && paciente.dni.includes(searchTerm)),
  )

  const handleOpenModal = (paciente: Paciente) => {
    setSelectedPaciente(paciente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPaciente(null)
  }

  const handleOpenNuevoModal = () => {
    setIsNuevoModalOpen(true)
  }

  const handleCloseNuevoModal = () => {
    setIsNuevoModalOpen(false)
  }

  // Determinar si el usuario puede editar pacientes
  const canEdit = user.rol === "MedicoJefe" || user.rol === "Medico"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground mt-1">Gestión de pacientes del hospital</p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleOpenNuevoModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre, historia clínica o DNI..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Historia Clínica</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fojas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente) => (
                    <TableRow key={paciente.id}>
                      <TableCell className="font-medium">{paciente.nombre}</TableCell>
                      <TableCell>{paciente.num_historia_clinica}</TableCell>
                      <TableCell>{paciente.dni || "-"}</TableCell>
                      <TableCell>
                        {paciente.fecha_nacimiento
                          ? format(new Date(paciente.fecha_nacimiento), "dd/MM/yyyy", { locale: es })
                          : "-"}
                      </TableCell>
                      <TableCell>{paciente.genero || "-"}</TableCell>
                      <TableCell>{paciente.telefono || "-"}</TableCell>
                      <TableCell>
                        {fojasCount[paciente.num_historia_clinica] ? (
                          <span className="font-medium">{fojasCount[paciente.num_historia_clinica]}</span>
                        ) : (
                          "0"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenModal(paciente)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Link href={`/pacientes/${paciente.id}/fojas`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Fojas
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No se encontraron pacientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver/editar paciente */}
      {selectedPaciente && (
        <PacienteModal isOpen={isModalOpen} onClose={handleCloseModal} paciente={selectedPaciente} canEdit={canEdit} />
      )}

      {/* Modal para nuevo paciente */}
      <NuevoPacienteModal isOpen={isNuevoModalOpen} onClose={handleCloseNuevoModal} />
    </div>
  )
}
