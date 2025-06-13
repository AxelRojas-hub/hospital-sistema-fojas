export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string
          rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
          created_at: string
          habilitado: boolean
        }
        Insert: {
          id?: string
          email: string
          nombre: string
          rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
          created_at?: string
          habilitado?: boolean
        }
        Update: {
          id?: string
          email?: string
          nombre?: string
          rol?: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador"
          created_at?: string
          habilitado?: boolean
        }
      }
      fojas: {
        Row: {
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
          created_at: string
          invalida?: boolean
        }
        Insert: {
          id?: string
          nombre_paciente: string
          num_historia_clinica: string
          fecha: string
          cirujano: string
          ayudante1?: string | null
          ayudante2?: string | null
          ayudante3?: string | null
          anestesiologo?: string | null
          anestesia: "general" | "local"
          instrumentador?: string | null
          riesgo_quirurgico: "alto" | "mediano" | "bajo"
          diagnostico_preoperatorio: string
          plan_quirurgico: string
          diagnostico_postoperatorio: string
          operacion_realizada: string
          anatomia_patologica?: string | null
          descripcion_tecnica: string
          medico_responsable: string
          medico_responsable_nombre: string
          created_at?: string
          invalida?: boolean
        }
        Update: {
          id?: string
          nombre_paciente?: string
          num_historia_clinica?: string
          fecha?: string
          cirujano?: string
          ayudante1?: string | null
          ayudante2?: string | null
          ayudante3?: string | null
          anestesiologo?: string | null
          anestesia?: "general" | "local"
          instrumentador?: string | null
          riesgo_quirurgico?: "alto" | "mediano" | "bajo"
          diagnostico_preoperatorio?: string
          plan_quirurgico?: string
          diagnostico_postoperatorio?: string
          operacion_realizada?: string
          anatomia_patologica?: string | null
          descripcion_tecnica?: string
          medico_responsable?: string
          medico_responsable_nombre?: string
          created_at?: string
          invalida?: boolean
        }
      }
      pacientes: {
        Row: {
          id: string
          nombre: string
          num_historia_clinica: string
          fecha_nacimiento: string | null
          genero: string | null
          direccion: string | null
          telefono: string | null
          dni: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          num_historia_clinica: string
          fecha_nacimiento?: string | null
          genero?: string | null
          direccion?: string | null
          telefono?: string | null
          dni?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          num_historia_clinica?: string
          fecha_nacimiento?: string | null
          genero?: string | null
          direccion?: string | null
          telefono?: string | null
          dni?: string | null
          created_at?: string
        }
      }
    }
  }
}
