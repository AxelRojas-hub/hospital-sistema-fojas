-- Insertar usuarios de ejemplo
INSERT INTO usuarios (email, nombre, rol)
VALUES 
  ('jefe@hospital.com', 'Dr. Carlos Rodríguez', 'MedicoJefe'),
  ('medico1@hospital.com', 'Dra. Laura Martínez', 'Medico'),
  ('medico2@hospital.com', 'Dr. Juan Pérez', 'Medico'),
  ('enfermero1@hospital.com', 'Enf. Ana García', 'Enfermero'),
  ('enfermero2@hospital.com', 'Enf. Miguel López', 'Enfermero')
ON CONFLICT (email) DO NOTHING;

-- Insertar pacientes de ejemplo
INSERT INTO pacientes (nombre, num_historia_clinica, fecha_nacimiento, genero)
VALUES 
  ('María González', 'HC-001-2023', '1975-05-15', 'Femenino'),
  ('Roberto Sánchez', 'HC-002-2023', '1982-11-23', 'Masculino'),
  ('Lucía Fernández', 'HC-003-2023', '1990-03-07', 'Femenino'),
  ('Jorge Ramírez', 'HC-004-2023', '1968-09-30', 'Masculino'),
  ('Sofía Torres', 'HC-005-2023', '1995-12-18', 'Femenino')
ON CONFLICT (num_historia_clinica) DO NOTHING;

-- Obtener IDs de usuarios para las fojas
DO $$
DECLARE
  jefe_id UUID;
  medico1_id UUID;
  medico2_id UUID;
BEGIN
  SELECT id INTO jefe_id FROM usuarios WHERE email = 'jefe@hospital.com';
  SELECT id INTO medico1_id FROM usuarios WHERE email = 'medico1@hospital.com';
  SELECT id INTO medico2_id FROM usuarios WHERE email = 'medico2@hospital.com';
  
  -- Insertar fojas de ejemplo
  INSERT INTO fojas (
    nombre_paciente, 
    num_historia_clinica, 
    fecha, 
    cirujano, 
    ayudante1, 
    anestesiologo, 
    anestesia, 
    instrumentador, 
    riesgo_quirurgico, 
    diagnostico_preoperatorio, 
    plan_quirurgico, 
    diagnostico_postoperatorio, 
    operacion_realizada, 
    descripcion_tecnica, 
    medico_responsable,
    medico_responsable_nombre
  )
  VALUES 
    (
      'María González', 
      'HC-001-2023', 
      '2023-10-15', 
      jefe_id, 
      medico1_id, 
      'Dr. Alberto Gómez', 
      'general', 
      'Inst. Patricia Díaz', 
      'bajo', 
      'Colelitiasis', 
      'Colecistectomía laparoscópica', 
      'Colelitiasis confirmada', 
      'Colecistectomía laparoscópica', 
      'Se realizó abordaje laparoscópico con 4 puertos. Se identificó vesícula biliar con múltiples cálculos. Se procedió a disección del triángulo de Calot, identificando y clipando conducto cístico y arteria cística. Se separó vesícula del lecho hepático con electrocauterio. Extracción de pieza por puerto umbilical. Cierre por planos.', 
      jefe_id,
      'Dr. Carlos Rodríguez'
    ),
    (
      'Roberto Sánchez', 
      'HC-002-2023', 
      '2023-11-05', 
      medico1_id, 
      medico2_id, 
      'Dra. Claudia Morales', 
      'general', 
      'Inst. Fernando Ruiz', 
      'mediano', 
      'Hernia inguinal derecha', 
      'Hernioplastía inguinal con malla', 
      'Hernia inguinal directa derecha', 
      'Hernioplastía con técnica de Lichtenstein', 
      'Incisión inguinal derecha. Disección por planos hasta identificar saco herniario. Reducción de contenido. Refuerzo de pared posterior con malla de polipropileno fijada con puntos simples. Cierre por planos.', 
      medico1_id,
      'Dra. Laura Martínez'
    )
  ON CONFLICT DO NOTHING;
END $$;
