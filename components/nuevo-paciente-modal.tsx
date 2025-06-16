"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { ControllerPaciente } from "@/controllers/ControllerPaciente"
import { useRouter } from "next/navigation"

interface NuevoPacienteModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NuevoPacienteModal({ isOpen, onClose }: NuevoPacienteModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: "",
    num_historia_clinica: "",
    dni: "",
    fecha_nacimiento: "",
    genero: "",
    direccion: "",
    telefono: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validar campos requeridos (opcional, ya lo hace el controller)
    if (!formData.nombre || !formData.num_historia_clinica) {
      setError("El nombre y número de historia clínica son obligatorios")
      setLoading(false)
      return
    }

    try {
      await ControllerPaciente.crearPaciente(formData)
      setSuccess("Paciente creado correctamente")
      setFormData({
        nombre: "",
        num_historia_clinica: "",
        dni: "",
        fecha_nacimiento: "",
        genero: "",
        direccion: "",
        telefono: "",
      })
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear el paciente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo Paciente</DialogTitle>
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
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_historia_clinica">Número historia clínica *</Label>
              <Input
                id="num_historia_clinica"
                name="num_historia_clinica"
                value={formData.num_historia_clinica}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" name="dni" value={formData.dni} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar paciente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
