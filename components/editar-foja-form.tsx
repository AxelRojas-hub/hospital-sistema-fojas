"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

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

interface EditarFojaFormProps {
  user: User
  foja: Foja
}

export default function EditarFojaForm({ user, foja }: EditarFojaFormProps) {
  const router = useRouter()
  const supabase = createClientClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombre_paciente: foja.nombre_paciente,
    num_historia_clinica: foja.num_historia_clinica,
    fecha: foja.fecha,
    cirujano: foja.cirujano || "",
    ayudante1: foja.ayudante1 || "",
    ayudante2: foja.ayudante2 || "",
    ayudante3: foja.ayudante3 || "",
    anestesiologo: foja.anestesiologo || "",
    anestesia: foja.anestesia,
    instrumentador: foja.instrumentador || "",
    riesgo_quirurgico: foja.riesgo_quirurgico,
    diagnostico_preoperatorio: foja.diagnostico_preoperatorio,
    plan_quirurgico: foja.plan_quirurgico,
    diagnostico_postoperatorio: foja.diagnostico_postoperatorio,
    operacion_realizada: foja.operacion_realizada,
    anatomia_patologica: foja.anatomia_patologica || "",
    descripcion_tecnica: foja.descripcion_tecnica,
    medico_responsable: foja.medico_responsable,
    medico_responsable_nombre: foja.medico_responsable_nombre,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("fojas").update(formData).eq("id", foja.id)

      if (error) {
        throw error
      }

      router.push(`/fojas/${foja.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al actualizar la foja médica")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/fojas/${foja.id}`} className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al detalle de la foja
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Editar Foja Médica</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {foja.invalida && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta foja ha sido marcada como inválida. Los cambios que realices quedarán registrados.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Paciente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre_paciente">Nombre completo</Label>
                <Input
                  id="nombre_paciente"
                  name="nombre_paciente"
                  value={formData.nombre_paciente}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="num_historia_clinica">Número historia clínica</Label>
                <Input
                  id="num_historia_clinica"
                  name="num_historia_clinica"
                  value={formData.num_historia_clinica}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" name="fecha" type="date" value={formData.fecha} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipo Médico</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cirujano">Cirujano</Label>
                <Input id="cirujano" name="cirujano" value={formData.cirujano} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ayudante1">1er Ayudante</Label>
                <Input id="ayudante1" name="ayudante1" value={formData.ayudante1} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ayudante2">2do Ayudante</Label>
                <Input id="ayudante2" name="ayudante2" value={formData.ayudante2} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ayudante3">3er Ayudante</Label>
                <Input id="ayudante3" name="ayudante3" value={formData.ayudante3} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anestesiologo">Anestesiólogo</Label>
                <Input id="anestesiologo" name="anestesiologo" value={formData.anestesiologo} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anestesia">Anestesia</Label>
                <RadioGroup
                  value={formData.anestesia}
                  onValueChange={(value) => handleRadioChange("anestesia", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="anestesia-general" />
                    <Label htmlFor="anestesia-general">General</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="anestesia-local" />
                    <Label htmlFor="anestesia-local">Local</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instrumentador">Instrumentador</Label>
                <Input
                  id="instrumentador"
                  name="instrumentador"
                  value={formData.instrumentador}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riesgo_quirurgico">Riesgo quirúrgico</Label>
                <RadioGroup
                  value={formData.riesgo_quirurgico}
                  onValueChange={(value) => handleRadioChange("riesgo_quirurgico", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bajo" id="riesgo-bajo" />
                    <Label htmlFor="riesgo-bajo">Bajo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mediano" id="riesgo-mediano" />
                    <Label htmlFor="riesgo-mediano">Mediano</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alto" id="riesgo-alto" />
                    <Label htmlFor="riesgo-alto">Alto</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Quirúrgica</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnostico_preoperatorio">Diagnóstico preoperatorio</Label>
                <Input
                  id="diagnostico_preoperatorio"
                  name="diagnostico_preoperatorio"
                  value={formData.diagnostico_preoperatorio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan_quirurgico">Plan quirúrgico</Label>
                <Input
                  id="plan_quirurgico"
                  name="plan_quirurgico"
                  value={formData.plan_quirurgico}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnostico_postoperatorio">Diagnóstico postoperatorio</Label>
                <Input
                  id="diagnostico_postoperatorio"
                  name="diagnostico_postoperatorio"
                  value={formData.diagnostico_postoperatorio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operacion_realizada">Operación realizada</Label>
                <Input
                  id="operacion_realizada"
                  name="operacion_realizada"
                  value={formData.operacion_realizada}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anatomia_patologica">Anatomía patológica</Label>
                <Input
                  id="anatomia_patologica"
                  name="anatomia_patologica"
                  value={formData.anatomia_patologica}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion_tecnica">Descripción técnica operatoria</Label>
                <Textarea
                  id="descripcion_tecnica"
                  name="descripcion_tecnica"
                  value={formData.descripcion_tecnica}
                  onChange={handleChange}
                  required
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medico_responsable_nombre">Médico responsable</Label>
                <Input
                  id="medico_responsable_nombre"
                  name="medico_responsable_nombre"
                  value={formData.medico_responsable_nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Link href={`/fojas/${foja.id}`}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
