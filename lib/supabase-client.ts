import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

// Variable global para almacenar la instancia del cliente
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClientClient() {
  // Si ya existe una instancia, devuélvela
  if (supabaseClient) return supabaseClient

  // Si no existe, crea una nueva instancia
  supabaseClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}
