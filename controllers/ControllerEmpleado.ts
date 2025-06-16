import { createClientClient } from "@/lib/supabase-client"
import { Empleado } from "@/models/Empleado"

export async function crearUsuario({
  id,
  email,
  nombre,
  rol,
  habilitado = true,
}: {
  id: string
  email: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
  habilitado?: boolean
}) {
  const supabase = createClientClient()
  const usuario = Empleado.fromUser({
    id,
    rol,
    nombre,
    email,
    habilitado,
  })
  const usuarioData = {
    id,
    email: usuario.email,
    nombre: usuario.nombreCompleto(),
    rol: usuario.rol,
    habilitado: usuario.habilitado,
  }
  const { error } = await supabase.from("usuarios").insert([usuarioData])
  return { error }
}

export async function actualizarUsuario({
  id,
  nombre,
  rol,
}: {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
}) {
  const supabase = createClientClient()
  const { error } = await supabase
    .from("usuarios")
    .update({ nombre, rol })
    .eq("id", id)
  return { error }
}

export async function cambiarPassword({
  id,
  newPassword,
}: {
  id: string
  newPassword: string
}) {
  const supabase = createClientClient()
  // Solo funciona si tienes privilegios de admin en Supabase
  const { error } = await supabase.auth.admin.updateUserById(id, {
    password: newPassword,
  })
  return { error }
}
