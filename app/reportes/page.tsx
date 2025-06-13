import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ReportesContent from "@/components/reportes-content"

export default async function ReportesPage() {
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

  // Obtener estadísticas para los reportes
  const { count: totalPacientes } = await supabase.from("pacientes").select("*", { count: "exact", head: true })

  const { count: totalFojas } = await supabase.from("fojas").select("*", { count: "exact", head: true })

  // Obtener fojas por riesgo quirúrgico
  const { data: fojasPorRiesgo } = await supabase.from("fojas").select("riesgo_quirurgico")

  const riesgoBajo = fojasPorRiesgo?.filter((f) => f.riesgo_quirurgico === "bajo").length || 0
  const riesgoMediano = fojasPorRiesgo?.filter((f) => f.riesgo_quirurgico === "mediano").length || 0
  const riesgoAlto = fojasPorRiesgo?.filter((f) => f.riesgo_quirurgico === "alto").length || 0

  const stats = {
    totalPacientes: totalPacientes || 0,
    totalFojas: totalFojas || 0,
    riesgoBajo,
    riesgoMediano,
    riesgoAlto,
  }

  return <ReportesContent user={userData} stats={stats} />
}
