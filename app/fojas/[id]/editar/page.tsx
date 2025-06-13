import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import EditarFojaForm from "@/components/editar-foja-form"

export default async function EditarFojaPage({ params }: { params: { id: string } }) {
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

  // Verificar si el usuario tiene permisos para editar (MedicoJefe o Medico)
  if (userData.rol !== "MedicoJefe" && userData.rol !== "Medico") {
    redirect(`/fojas/${params.id}`)
  }

  // Obtener datos de la foja
  const { data: foja, error: fojaError } = await supabase.from("fojas").select("*").eq("id", params.id).single()

  if (fojaError || !foja) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Foja no encontrada</h1>
        <p>La foja médica que estás buscando no existe o no tienes permisos para editarla.</p>
      </div>
    )
  }

  return <EditarFojaForm user={userData} foja={foja} />
}
