import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import PacientesContent from "@/components/pacientes-content"

export default async function PacientesPage() {
  const supabase = await createServerClient()

  // Obtener la sesión y verificar autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Usar getUser para obtener datos autenticados del usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar si el usuario existe en la tabla usuarios
  const { data: userData, error } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle() // Usamos maybeSingle en lugar de single para evitar el error

  if (error || !userData) {
    redirect("/dashboard") // Redirigir al dashboard donde se mostrará el mensaje de error
  }

  // Obtener lista de pacientes
  const { data: pacientes } = await supabase.from("pacientes").select("*").order("nombre")

  // Obtener conteo de fojas por paciente (usando num_historia_clinica como clave)
  const { data: fojas } = await supabase.from("fojas").select("num_historia_clinica")

  // Crear un objeto con el conteo de fojas por número de historia clínica
  const fojasCount: Record<string, number> = {}

  if (fojas) {
    fojas.forEach((foja) => {
      if (fojasCount[foja.num_historia_clinica]) {
        fojasCount[foja.num_historia_clinica]++
      } else {
        fojasCount[foja.num_historia_clinica] = 1
      }
    })
  }

  return <PacientesContent user={userData} pacientes={pacientes || []} fojasCount={fojasCount} />
}
