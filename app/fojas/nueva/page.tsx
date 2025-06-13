import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import NuevaFojaForm from "@/components/nueva-foja-form"

export default async function NuevaFojaPage() {
  const supabase = await createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Obtener información del usuario incluyendo el rol
  const { data: userData } = await supabase.from("usuarios").select("*").eq("id", session.user.id).single()

  // Verificar si el usuario tiene permisos para crear fojas (MedicoJefe o Medico)
  if (!userData || (userData.rol !== "MedicoJefe" && userData.rol !== "Medico")) {
    redirect("/fojas")
  }

  // Obtener lista de médicos para los selectores
  const { data: medicos } = await supabase
    .from("usuarios")
    .select("id, nombre")
    .in("rol", ["MedicoJefe", "Medico"])
    .order("nombre")

  // Obtener lista de pacientes para autocompletar
  const { data: pacientes } = await supabase
    .from("pacientes")
    .select("id, nombre, num_historia_clinica, fecha_nacimiento, dni")
    .order("nombre")

  return <NuevaFojaForm user={userData} medicos={medicos || []} pacientes={pacientes || []} />
}
