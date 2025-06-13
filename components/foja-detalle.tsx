"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Ban, Printer } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { createClientClient } from "@/lib/supabase-client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
}

interface Foja {
  id: string
  nombre_paciente: string
  num_historia_clinica: string
  fecha: string
  cirujano: string
  ayudante1: string | null
  ayudante2: string | null
  ayudante3: string | null
  anestesiologo: string | null
  anestesia: "general" | "local"
  instrumentador: string | null
  riesgo_quirurgico: "alto" | "mediano" | "bajo"
  diagnostico_preoperatorio: string
  plan_quirurgico: string
  diagnostico_postoperatorio: string
  operacion_realizada: string
  anatomia_patologica: string | null
  descripcion_tecnica: string
  medico_responsable: string
  medico_responsable_nombre: string
  invalida?: boolean
}

interface FojaDetalleProps {
  user: User
  foja: Foja
}

export default function FojaDetalle({ user, foja }: FojaDetalleProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientClient()

  const handleToggleInvalida = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.from("fojas").update({ invalida: !foja.invalida }).eq("id", foja.id)

      if (error) throw error

      // Refrescar la página para mostrar los cambios
      router.refresh()
    } catch (error) {
      console.error("Error al actualizar el estado de la foja:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Determinar qué acciones puede realizar el usuario según su rol
  const canMarkInvalid = user.rol === "MedicoJefe"
  const canEdit = user.rol === "MedicoJefe" || user.rol === "Medico"

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/fojas" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Fojas
          </Link>
          <h1 className="text-3xl font-bold">Detalle de Foja Médica</h1>
          <p className="text-muted-foreground mt-1">
            {foja.nombre_paciente} - HC: {foja.num_historia_clinica}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>

          {canEdit && (
            <Link href={`/fojas/${foja.id}/editar`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
          )}

          {canMarkInvalid && (
            <Button
              variant={foja.invalida ? "outline" : "destructive"}
              onClick={handleToggleInvalida}
              disabled={loading}
            >
              <Ban className="h-4 w-4 mr-2" />
              {foja.invalida ? "Validar" : "Invalidar"}
            </Button>
          )}
        </div>
      </div>

      {foja.invalida && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <Ban className="h-5 w-5 mr-2" />
          <span className="font-medium">Esta foja ha sido marcada como inválida</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Información del Paciente</span>
              <span className="text-sm font-normal text-muted-foreground">
                Fecha: {format(new Date(foja.fecha), "dd/MM/yyyy", { locale: es })}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre completo</p>
              <p>{foja.nombre_paciente}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Número historia clínica</p>
              <p>{foja.num_historia_clinica}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipo Médico</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cirujano</p>
              <p>{foja.cirujano || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">1er Ayudante</p>
              <p>{foja.ayudante1 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">2do Ayudante</p>
              <p>{foja.ayudante2 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">3er Ayudante</p>
              <p>{foja.ayudante3 || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Anestesiólogo</p>
              <p>{foja.anestesiologo || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Anestesia</p>
              <p className="capitalize">{foja.anestesia}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Instrumentador</p>
              <p>{foja.instrumentador || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Riesgo quirúrgico</p>
              <p className="capitalize">{foja.riesgo_quirurgico}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Quirúrgica</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diagnóstico preoperatorio</p>
              <p>{foja.diagnostico_preoperatorio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan quirúrgico</p>
              <p>{foja.plan_quirurgico}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diagnóstico postoperatorio</p>
              <p>{foja.diagnostico_postoperatorio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operación realizada</p>
              <p>{foja.operacion_realizada}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Anatomía patológica</p>
              <p>{foja.anatomia_patologica || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Descripción técnica operatoria</p>
              <p className="whitespace-pre-wrap">{foja.descripcion_tecnica}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Médico responsable</p>
              <p>{foja.medico_responsable_nombre}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
