import { createClientClient } from "@/lib/supabase-client"
import type { Database } from "@/types/supabase"

export class ControllerFoja {
 
  static async crearFojaMedica(formData: any, pacientes: any[]): Promise<{ error: string | null }> {
    const supabase = createClientClient()
    let pacienteExistente = pacientes.find((p) => p.num_historia_clinica === formData.num_historia_clinica)
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
          return { error: `Error al crear el paciente: ${pacienteError.message}` }
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
        return { error: fojaError.message }
      }
      return { error: null }
    } catch (err: any) {
      return { error: err.message || "Ocurrió un error al guardar la foja médica" }
    }
  }

  static async toggleInvalida(fojaId: string, currentStatus: boolean | undefined): Promise<{ error: any }> {
    const supabase = createClientClient()
    const { error } = await supabase.from("fojas").update({ invalida: !currentStatus }).eq("id", fojaId)
    return { error }
  }
}
