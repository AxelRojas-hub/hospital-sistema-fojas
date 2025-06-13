-- Añadir campo 'invalida' a la tabla fojas
ALTER TABLE fojas ADD COLUMN IF NOT EXISTS invalida BOOLEAN DEFAULT false;
