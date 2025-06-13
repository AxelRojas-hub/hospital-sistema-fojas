import type React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Navbar from "@/components/navbar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

export default async function ReportesLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto py-8 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Error al consultar la base de datos</h1>
            <p className="mb-4">Ocurrió un error al intentar obtener los datos del usuario.</p>
            <p className="text-sm text-muted-foreground mb-6">Detalles del error: {error.message}</p>
            <Link href="/login">
              <Button>Volver al inicio de sesión</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Si no se encontró el usuario en la tabla usuarios
  if (!userData) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gray-50">
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
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userName={userData.nombre} userRole={userData.rol} />
      <main className="flex-1 bg-gray-50">{children}</main>
      <Footer />
    </div>
  )
}
