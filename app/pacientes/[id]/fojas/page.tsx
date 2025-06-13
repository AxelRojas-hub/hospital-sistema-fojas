import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import PacienteFojasContent from "@/components/paciente-fojas-content"

export default async function PacienteFojasPage({ params }: { params: { id: string } }) {
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
  const { data: userData, error: userError } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (userError || !userData) {
    redirect("/dashboard")
  }

  // Obtener datos del paciente
  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", params.id)
    .single()

  if (pacienteError || !paciente) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Paciente no encontrado</h1>
        <p>El paciente que estás buscando no existe o no tienes permisos para verlo.</p>
      </div>
    )
  }

  // Obtener fojas del paciente
  const { data: fojas } = await supabase
    .from("fojas")
    .select("*")
    .eq("num_historia_clinica", paciente.num_historia_clinica)
    .order("fecha", { ascending: false })

  return <PacienteFojasContent user={userData} paciente={paciente} fojas={fojas || []} />
}
