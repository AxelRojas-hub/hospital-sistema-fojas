import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import DashboardContent from "@/components/dashboard-content"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
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
  const { data: userData, error } = await supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle()

  if (error) {
    console.error("Error al consultar la tabla usuarios:", error)
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error al consultar la base de datos</h1>
        <p className="mb-4">Ocurrió un error al intentar obtener los datos del usuario.</p>
        <p className="text-sm text-muted-foreground mb-6">Detalles del error: {error.message}</p>
        <Link href="/login">
          <Button>Volver al inicio de sesión</Button>
        </Link>
      </div>
    )
  }

  // Si no se encontró el usuario en la tabla usuarios
  if (!userData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Usuario no encontrado en la base de datos</h1>
        <p className="mb-4">
          Tu cuenta está autenticada correctamente, pero no se encontró un registro correspondiente en la tabla
          usuarios.
        </p>
        <p className="text-sm text-muted-foreground mb-2">
          ID de usuario: {user.id}
          <br />
          Email: {user.email}
        </p>
        <div className="flex flex-col gap-4 items-center justify-center mt-6">
          <p>Opciones para solucionar este problema:</p>
          <div className="flex gap-4">
            <Link href="/crear-usuario">
              <Button>Crear nuevo usuario</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Volver al inicio de sesión</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Si el usuario está deshabilitado, redirigir al login con mensaje
  if (userData.habilitado === false) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Usuario deshabilitado</h1>
        <p className="mb-4">Tu cuenta ha sido deshabilitada. Por favor, contacta con el administrador del sistema.</p>
        <Link href="/login">
          <Button>Volver al inicio de sesión</Button>
        </Link>
      </div>
    )
  }

  // Si el usuario es administrador, redirigir al panel de administración
  if (userData.rol === "Administrador") {
    redirect("/admin")
  }

  return <DashboardContent user={userData} />
}
