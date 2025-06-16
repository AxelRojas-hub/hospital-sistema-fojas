import { createClientClient } from "@/lib/supabase-client"

export class ControllerPaciente {
    static async crearPaciente(formData: {
        nombre: string
        num_historia_clinica: string
        dni?: string
        fecha_nacimiento?: string
        genero?: string
        direccion?: string
        telefono?: string
    }) {
        const supabase = createClientClient()

        // Validar campos requeridos
        if (!formData.nombre || !formData.num_historia_clinica) {
            throw new Error("El nombre y número de historia clínica son obligatorios")
        }

        // Verificar si ya existe un paciente con el mismo número de historia clínica
        const { data: existingPatient } = await supabase
            .from("pacientes")
            .select("id")
            .eq("num_historia_clinica", formData.num_historia_clinica)
            .maybeSingle()

        if (existingPatient) {
            throw new Error("Ya existe un paciente con este número de historia clínica")
        }

        // Crear nuevo paciente
        const { error } = await supabase.from("pacientes").insert([
            {
                nombre: formData.nombre,
                num_historia_clinica: formData.num_historia_clinica,
                dni: formData.dni || null,
                fecha_nacimiento: formData.fecha_nacimiento || null,
                genero: formData.genero || null,
                direccion: formData.direccion || null,
                telefono: formData.telefono || null,
            },
        ])

        if (error) throw error

        return true
    }

    static async actualizarPaciente(id: string, formData: {
        nombre: string
        num_historia_clinica: string
        dni?: string
        fecha_nacimiento?: string
        genero?: string
        direccion?: string
        telefono?: string
    }) {
        const supabase = createClientClient()

        // Validar campos requeridos
        if (!formData.nombre || !formData.num_historia_clinica) {
            throw new Error("El nombre y número de historia clínica son obligatorios")
        }

        // Actualizar paciente
        const { error } = await supabase
            .from("pacientes")
            .update({
                nombre: formData.nombre,
                num_historia_clinica: formData.num_historia_clinica,
                dni: formData.dni || null,
                fecha_nacimiento: formData.fecha_nacimiento || null,
                genero: formData.genero || null,
                direccion: formData.direccion || null,
                telefono: formData.telefono || null,
            })
            .eq("id", id)

        if (error) throw error

        return true
    }
}
