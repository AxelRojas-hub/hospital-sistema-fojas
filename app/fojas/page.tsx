import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import FojasContent from "@/components/fojas-content"

export default async function FojasPage() {
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

  // Obtener lista de fojas
  const { data: fojas } = await supabase.from("fojas").select("*").order("fecha", { ascending: false })

  return <FojasContent user={userData} fojas={fojas || []} />
}
