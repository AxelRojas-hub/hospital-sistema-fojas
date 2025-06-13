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
import { createClientClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface Usuario {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
  email: string
  habilitado: boolean
}

interface EditarUsuarioModalProps {
  isOpen: boolean
  onClose: () => void
  usuario: Usuario
  currentUser: Usuario
}

export default function EditarUsuarioModal({ isOpen, onClose, usuario, currentUser }: EditarUsuarioModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const router = useRouter()
  const supabase = createClientClient()

  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    rol: usuario.rol,
    email: usuario.email,
    newPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador") => {
    setFormData((prev) => ({ ...prev, rol: value }))
  }

  const handleTogglePasswordReset = () => {
    setShowPasswordReset(!showPasswordReset)
    if (!showPasswordReset) {
      setFormData((prev) => ({ ...prev, newPassword: "" }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Actualizar datos del usuario en la tabla usuarios
      const { error: dbError } = await supabase
        .from("usuarios")
        .update({
          nombre: formData.nombre,
          rol: formData.rol,
        })
        .eq("id", usuario.id)

      if (dbError) throw dbError

      // Si se está cambiando la contraseña
      if (showPasswordReset && formData.newPassword) {
        // Solo los administradores pueden cambiar contraseñas
        const { error: authError } = await supabase.auth.admin.updateUserById(usuario.id, {
          password: formData.newPassword,
        })

        if (authError) throw authError
      }

      setSuccess("Usuario actualizado correctamente")

      // Refrescar la página después de un breve retraso
      setTimeout(() => {
        router.refresh()
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar el usuario")
    } finally {
      setLoading(false)
    }
  }

  // Verificar si el usuario actual está editando su propia cuenta
  const isEditingSelf = currentUser.id === usuario.id

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
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
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" name="email" value={formData.email} disabled />
            <p className="text-xs text-muted-foreground">El correo electrónico no se puede cambiar</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador") =>
                handleSelectChange(value)
              }
              disabled={isEditingSelf} // No permitir cambiar el propio rol
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="MedicoJefe">Médico Jefe</SelectItem>
                <SelectItem value="Medico">Médico</SelectItem>
                <SelectItem value="Enfermero">Enfermero</SelectItem>
              </SelectContent>
            </Select>
            {isEditingSelf && <p className="text-xs text-muted-foreground">No puedes cambiar tu propio rol</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Button type="button" variant="link" onClick={handleTogglePasswordReset} className="h-auto p-0">
                {showPasswordReset ? "Cancelar cambio" : "Cambiar contraseña"}
              </Button>
            </div>
            {showPasswordReset && (
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nueva contraseña"
              />
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
