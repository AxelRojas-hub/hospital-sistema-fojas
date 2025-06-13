"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Edit, UserCheck, UserX } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { createClientClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import EditarUsuarioModal from "@/components/editar-usuario-modal"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
  email: string
  created_at: string
  habilitado: boolean
}

interface UsuariosAdminContentProps {
  currentUser: User
  usuarios: User[]
}

export default function UsuariosAdminContent({ currentUser, usuarios }: UsuariosAdminContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const router = useRouter()
  const supabase = createClientClient()

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.rol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleHabilitado = async (userId: string, currentStatus: boolean) => {
    // No permitir deshabilitar al usuario actual
    if (userId === currentUser.id) {
      alert("No puedes deshabilitar tu propia cuenta")
      return
    }

    setLoading((prev) => ({ ...prev, [userId]: true }))

    try {
      const { error } = await supabase.from("usuarios").update({ habilitado: !currentStatus }).eq("id", userId)

      if (error) throw error

      // Refrescar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedUser(null)
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-1">Administra los usuarios del sistema</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
          <Link href="/admin/crear-usuario">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id} className={!usuario.habilitado ? "bg-red-50" : ""}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{getRoleName(usuario.rol)}</TableCell>
                      <TableCell>{format(new Date(usuario.created_at), "dd/MM/yyyy", { locale: es })}</TableCell>
                      <TableCell>
                        {usuario.habilitado ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Habilitado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Deshabilitado</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditModal(usuario)}
                            disabled={loading[usuario.id]}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>

                          <Button
                            variant={usuario.habilitado ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => handleToggleHabilitado(usuario.id, usuario.habilitado)}
                            disabled={loading[usuario.id] || usuario.id === currentUser.id}
                          >
                            {usuario.habilitado ? (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Deshabilitar
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Habilitar
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para editar usuario */}
      {selectedUser && (
        <EditarUsuarioModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          usuario={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}
