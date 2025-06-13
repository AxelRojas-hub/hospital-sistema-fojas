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

interface Medico {
  id: string
  nombre: string
}

interface Paciente {
  id: string
  nombre: string
  num_historia_clinica: string
  fecha_nacimiento: string | null
  dni: string | null
}

interface User {
  id: string
  nombre: string
  rol: "MedicoJefe" | "Medico" | "Enfermero"
}

interface NuevaFojaFormProps {
  user: User
  medicos: Medico[]
  pacientes: Paciente[]
}

export default function NuevaFojaForm({ user, medicos, pacientes }: NuevaFojaFormProps) {
  const router = useRouter()
  const supabase = createClientClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pacienteExistente, setPacienteExistente] = useState<Paciente | null>(null)

  const [formData, setFormData] = useState({
    nombre_paciente: "",
    num_historia_clinica: "",
    fecha_nacimiento: "",
    dni: "",
    fecha: new Date().toISOString().split("T")[0],
    cirujano: "",
    ayudante1: "",
    ayudante2: "",
    ayudante3: "",
    anestesiologo: "",
    anestesia: "general",
    instrumentador: "",
    riesgo_quirurgico: "bajo",
    diagnostico_preoperatorio: "",
    plan_quirurgico: "",
    diagnostico_postoperatorio: "",
    operacion_realizada: "",
    anatomia_patologica: "",
    descripcion_tecnica: "",
    medico_responsable: user.id,
    medico_responsable_nombre: user.nombre,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si cambia el número de historia clínica, buscar si existe un paciente
    if (name === "num_historia_clinica") {
      buscarPaciente(value)
    }
  }

  const buscarPaciente = (numHistoriaClinica: string) => {
    const pacienteEncontrado = pacientes.find((p) => p.num_historia_clinica === numHistoriaClinica)

    if (pacienteEncontrado) {
      setPacienteExistente(pacienteEncontrado)
      // Actualizar los campos del formulario con los datos del paciente
      setFormData((prev) => ({
        ...prev,
        nombre_paciente: pacienteEncontrado.nombre,
        fecha_nacimiento: pacienteEncontrado.fecha_nacimiento || "",
        dni: pacienteEncontrado.dni || "",
      }))
    } else {
      setPacienteExistente(null)
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Si no existe el paciente, crearlo primero
      if (!pacienteExistente) {
        const { error: pacienteError } = await supabase.from("pacientes").insert([
          {
            nombre: formData.nombre_paciente,
            num_historia_clinica: formData.num_historia_clinica,
            fecha_nacimiento: formData.fecha_nacimiento || null,
            dni: formData.dni || null,
          },
        ])

        if (pacienteError) {
          throw new Error(`Error al crear el paciente: ${pacienteError.message}`)
        }
      }

      // Crear la foja médica
      const { error: fojaError } = await supabase.from("fojas").insert([
        {
          nombre_paciente: formData.nombre_paciente,
          num_historia_clinica: formData.num_historia_clinica,
          fecha: formData.fecha,
          cirujano: formData.cirujano,
          ayudante1: formData.ayudante1 || null,
          ayudante2: formData.ayudante2 || null,
          ayudante3: formData.ayudante3 || null,
          anestesiologo: formData.anestesiologo || null,
          anestesia: formData.anestesia,
          instrumentador: formData.instrumentador || null,
          riesgo_quirurgico: formData.riesgo_quirurgico,
          diagnostico_preoperatorio: formData.diagnostico_preoperatorio,
          plan_quirurgico: formData.plan_quirurgico,
          diagnostico_postoperatorio: formData.diagnostico_postoperatorio,
          operacion_realizada: formData.operacion_realizada,
          anatomia_patologica: formData.anatomia_patologica || null,
          descripcion_tecnica: formData.descripcion_tecnica,
          medico_responsable: formData.medico_responsable,
          medico_responsable_nombre: formData.medico_responsable_nombre,
        },
      ])

      if (fojaError) {
        throw fojaError
      }

      router.push("/fojas")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar la foja médica")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/fojas" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Fojas
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Nueva Foja Médica</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pacienteExistente && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Se encontró un paciente existente con este número de historia clínica. Los datos del paciente se han
            completado automáticamente.
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
                <Label htmlFor="dni">DNI</Label>
                <Input id="dni" name="dni" value={formData.dni} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la operación</Label>
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
            <Link href="/fojas">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Foja"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
