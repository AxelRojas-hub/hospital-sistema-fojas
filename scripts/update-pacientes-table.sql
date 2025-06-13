-- Añadir campo 'dni' a la tabla pacientes
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS dni TEXT;
