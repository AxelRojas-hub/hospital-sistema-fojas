import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import UsuariosAdminContent from "@/components/usuarios-admin-content"

export default async function UsuariosAdminPage() {
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

  // Verificar si el usuario existe en la tabla usuarios y es administrador
  const { data: userData, error } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle()

  if (error || !userData || userData.rol !== "Administrador") {
    redirect("/dashboard")
  }

  // Obtener lista de todos los usuarios
  const { data: usuarios } = await supabase.from("usuarios").select("*").order("nombre")

  return <UsuariosAdminContent currentUser={userData} usuarios={usuarios || []} />
}
