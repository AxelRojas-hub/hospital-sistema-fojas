-- Modificar la tabla usuarios para añadir el rol Administrador y campo habilitado
ALTER TABLE usuarios 
  DROP CONSTRAINT IF EXISTS usuarios_rol_check;

ALTER TABLE usuarios 
  ADD CONSTRAINT usuarios_rol_check 
  CHECK (rol IN ('MedicoJefe', 'Medico', 'Enfermero', 'Administrador'));

-- Añadir campo habilitado (por defecto true)
ALTER TABLE usuarios 
  ADD COLUMN IF NOT EXISTS habilitado BOOLEAN DEFAULT true;
