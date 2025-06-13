-- Modificar la restricción de clave foránea para permitir ON DELETE SET NULL
-- Primero eliminamos la restricción existente
ALTER TABLE fojas DROP CONSTRAINT IF EXISTS fojas_medico_responsable_fkey;

-- Luego creamos una nueva restricción con ON DELETE SET NULL
ALTER TABLE fojas 
ADD CONSTRAINT fojas_medico_responsable_fkey 
FOREIGN KEY (medico_responsable) 
REFERENCES usuarios(id) 
ON DELETE SET NULL;

-- Modificar la estructura de la tabla fojas para permitir valores nulos en medico_responsable
ALTER TABLE fojas ALTER COLUMN medico_responsable DROP NOT NULL;
