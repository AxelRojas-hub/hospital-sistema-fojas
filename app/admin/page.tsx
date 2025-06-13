import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
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

  if (error || !userData) {
    redirect("/dashboard")
  }

  // Verificar si el usuario es administrador
  if (userData.rol !== "Administrador") {
    redirect("/dashboard")
  }

  // Verificar si el usuario está habilitado
  if (userData.habilitado === false) {
    redirect("/login")
  }

  return <AdminDashboard user={userData} />
}
