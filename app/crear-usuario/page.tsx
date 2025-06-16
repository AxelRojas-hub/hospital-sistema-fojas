"use client"

import type React from "react"

import { useState } from "react"
import { createClientClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Empleado } from "@/models/Empleado"
import { crearUsuario } from "@/controllers/ControllerEmpleado"

export default function CrearUsuarioPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombre, setNombre] = useState("")
  const [rol, setRol] = useState<"MedicoJefe" | "Medico" | "Enfermero" | "">("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClientClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setUserId(null)

    if (!email || !password || !nombre || !rol) {
      setError("Todos los campos son obligatorios")
      setLoading(false)
      return
    }

    try {
      // 1. Crear el usuario en supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (authError) throw authError
      if (!authData.user) {
        throw new Error("No se pudo crear el usuario")
      }

      // Iniciar sesión automáticamente con el usuario creado
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

      setUserId(authData.user.id)

      // Abstraído: creación e inserción de médico
      if (rol === "Medico" || rol === "MedicoJefe" || rol === "Enfermero") {
        const { error: dbError } = await crearUsuario({
          id: authData.user.id,
          email,
          nombre,
          rol: rol as "MedicoJefe" | "Medico" | "Enfermero",
        })
        if (dbError) throw dbError
      } else {
        // Si se agregan otros roles, aquí se puede manejar la inserción
        throw new Error("Rol no soportado")
      }

      setSuccess(`Usuario ${nombre} creado exitosamente con el rol de ${rol}`)
      setEmail("")
      setPassword("")
      setNombre("")
      setRol("")
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al crear el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Usuario</CardTitle>
          <CardDescription className="text-center">Crea un nuevo usuario para el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-500 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {success}
                {userId && (
                  <div className="mt-2 text-xs">
                    <p>ID del usuario: {userId}</p>
                    <p className="mt-1">
                      Guarda este ID para referencia futura. Lo necesitarás si tienes que solucionar problemas con este
                      usuario.
                    </p>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Dr. Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select value={rol} onValueChange={(value: "MedicoJefe" | "Medico" | "Enfermero") => setRol(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MedicoJefe">Médico Jefe</SelectItem>
                  <SelectItem value="Medico">Médico</SelectItem>
                  <SelectItem value="Enfermero">Enfermero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando usuario..." : "Crear usuario"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Volver al inicio de sesión
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
