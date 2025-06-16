"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { createClientClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { ControllerPaciente } from "@/controllers/ControllerPaciente"

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

interface PacienteModalProps {
  isOpen: boolean
  onClose: () => void
  paciente: Paciente
  canEdit: boolean
}

export default function PacienteModal({ isOpen, onClose, paciente, canEdit }: PacienteModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: paciente.nombre,
    num_historia_clinica: paciente.num_historia_clinica,
    dni: paciente.dni || "",
    fecha_nacimiento: paciente.fecha_nacimiento || "",
    genero: paciente.genero || "",
    direccion: paciente.direccion || "",
    telefono: paciente.telefono || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
    setSuccess(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      nombre: paciente.nombre,
      num_historia_clinica: paciente.num_historia_clinica,
      dni: paciente.dni || "",
      fecha_nacimiento: paciente.fecha_nacimiento || "",
      genero: paciente.genero || "",
      direccion: paciente.direccion || "",
      telefono: paciente.telefono || "",
    })
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await ControllerPaciente.actualizarPaciente(paciente.id, formData)
      setSuccess("Datos del paciente actualizados correctamente")
      setIsEditing(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar los datos del paciente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar paciente" : "Detalles del paciente"}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              {isEditing ? (
                <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
              ) : (
                <div className="p-2 border rounded bg-gray-50">{paciente.nombre}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_historia_clinica">Número historia clínica</Label>
              {isEditing ? (
                <Input
                  id="num_historia_clinica"
                  name="num_historia_clinica"
                  value={formData.num_historia_clinica}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="p-2 border rounded bg-gray-50">{paciente.num_historia_clinica}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              {isEditing ? (
                <Input id="dni" name="dni" value={formData.dni} onChange={handleChange} />
              ) : (
                <div className="p-2 border rounded bg-gray-50">{paciente.dni || "-"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              {isEditing ? (
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              ) : (
                <div className="p-2 border rounded bg-gray-50">
                  {paciente.fecha_nacimiento
                    ? format(new Date(paciente.fecha_nacimiento), "dd/MM/yyyy", { locale: es })
                    : "-"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              {isEditing ? (
                <Select value={formData.genero} onValueChange={(value) => handleSelectChange("genero", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 border rounded bg-gray-50">{paciente.genero || "-"}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              {isEditing ? (
                <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
              ) : (
                <div className="p-2 border rounded bg-gray-50">{paciente.telefono || "-"}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            {isEditing ? (
              <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
            ) : (
              <div className="p-2 border rounded bg-gray-50">{paciente.direccion || "-"}</div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              {canEdit && <Button onClick={handleEdit}>Editar</Button>}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
