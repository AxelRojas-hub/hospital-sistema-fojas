-- Crear tablas para la aplicación del Hospital Regional

-- Tabla de usuarios con roles
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('MedicoJefe', 'Medico', 'Enfermero')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  num_historia_clinica TEXT UNIQUE NOT NULL,
  fecha_nacimiento DATE,
  genero TEXT,
  direccion TEXT,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fojas médicas
CREATE TABLE IF NOT EXISTS fojas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_paciente TEXT NOT NULL,
  num_historia_clinica TEXT NOT NULL,
  fecha DATE NOT NULL,
  cirujano TEXT NOT NULL,
  ayudante1 TEXT,
  ayudante2 TEXT,
  ayudante3 TEXT,
  anestesiologo TEXT,
  anestesia TEXT NOT NULL CHECK (anestesia IN ('general', 'local')),
  instrumentador TEXT,
  riesgo_quirurgico TEXT NOT NULL CHECK (riesgo_quirurgico IN ('alto', 'mediano', 'bajo')),
  diagnostico_preoperatorio TEXT NOT NULL,
  plan_quirurgico TEXT NOT NULL,
  diagnostico_postoperatorio TEXT NOT NULL,
  operacion_realizada TEXT NOT NULL,
  anatomia_patologica TEXT,
  descripcion_tecnica TEXT NOT NULL,
  medico_responsable UUID NOT NULL REFERENCES usuarios(id),
  medico_responsable_nombre TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_fojas_num_historia_clinica ON fojas(num_historia_clinica);
CREATE INDEX IF NOT EXISTS idx_fojas_fecha ON fojas(fecha);
CREATE INDEX IF NOT EXISTS idx_fojas_medico_responsable ON fojas(medico_responsable);
