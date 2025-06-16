export class Foja {
    private nombre_paciente: string;
    private num_historia_clinica: string;
    private fecha_nacimiento?: string;
    private dni?: string;
    private fecha: string;
    private cirujano: string;
    private ayudante1?: string;
    private ayudante2?: string;
    private ayudante3?: string;
    private anestesiologo?: string;
    private anestesia: "general" | "local";
    private instrumentador?: string;
    private riesgo_quirurgico: "bajo" | "mediano" | "alto";
    private diagnostico_preoperatorio: string;
    private plan_quirurgico: string;
    private diagnostico_postoperatorio: string;
    private operacion_realizada: string;
    private anatomia_patologica?: string;
    private descripcion_tecnica: string;
    private medico_responsable: string; // id
    private medico_responsable_nombre: string;

    constructor(params: {
        nombre_paciente: string;
        num_historia_clinica: string;
        fecha_nacimiento?: string;
        dni?: string;
        fecha: string;
        cirujano: string;
        ayudante1?: string;
        ayudante2?: string;
        ayudante3?: string;
        anestesiologo?: string;
        anestesia: "general" | "local";
        instrumentador?: string;
        riesgo_quirurgico: "bajo" | "mediano" | "alto";
        diagnostico_preoperatorio: string;
        plan_quirurgico: string;
        diagnostico_postoperatorio: string;
        operacion_realizada: string;
        anatomia_patologica?: string;
        descripcion_tecnica: string;
        medico_responsable: string;
        medico_responsable_nombre: string;
    }) {
        this.nombre_paciente = params.nombre_paciente;
        this.num_historia_clinica = params.num_historia_clinica;
        this.fecha_nacimiento = params.fecha_nacimiento;
        this.dni = params.dni;
        this.fecha = params.fecha;
        this.cirujano = params.cirujano;
        this.ayudante1 = params.ayudante1;
        this.ayudante2 = params.ayudante2;
        this.ayudante3 = params.ayudante3;
        this.anestesiologo = params.anestesiologo;
        this.anestesia = params.anestesia;
        this.instrumentador = params.instrumentador;
        this.riesgo_quirurgico = params.riesgo_quirurgico;
        this.diagnostico_preoperatorio = params.diagnostico_preoperatorio;
        this.plan_quirurgico = params.plan_quirurgico;
        this.diagnostico_postoperatorio = params.diagnostico_postoperatorio;
        this.operacion_realizada = params.operacion_realizada;
        this.anatomia_patologica = params.anatomia_patologica;
        this.descripcion_tecnica = params.descripcion_tecnica;
        this.medico_responsable = params.medico_responsable;
        this.medico_responsable_nombre = params.medico_responsable_nombre;
    }

    // Getters y setters
    public getNombrePaciente() { return this.nombre_paciente; }
    public setNombrePaciente(value: string) { this.nombre_paciente = value; }

    public getNumHistoriaClinica() { return this.num_historia_clinica; }
    public setNumHistoriaClinica(value: string) { this.num_historia_clinica = value; }

    public getFechaNacimiento() { return this.fecha_nacimiento; }
    public setFechaNacimiento(value: string | undefined) { this.fecha_nacimiento = value; }

    public getDni() { return this.dni; }
    public setDni(value: string | undefined) { this.dni = value; }

    public getFecha() { return this.fecha; }
    public setFecha(value: string) { this.fecha = value; }

    public getCirujano() { return this.cirujano; }
    public setCirujano(value: string) { this.cirujano = value; }

    public getAyudante1() { return this.ayudante1; }
    public setAyudante1(value: string | undefined) { this.ayudante1 = value; }

    public getAyudante2() { return this.ayudante2; }
    public setAyudante2(value: string | undefined) { this.ayudante2 = value; }

    public getAyudante3() { return this.ayudante3; }
    public setAyudante3(value: string | undefined) { this.ayudante3 = value; }

    public getAnestesiologo() { return this.anestesiologo; }
    public setAnestesiologo(value: string | undefined) { this.anestesiologo = value; }

    public getAnestesia() { return this.anestesia; }
    public setAnestesia(value: "general" | "local") { this.anestesia = value; }

    public getInstrumentador() { return this.instrumentador; }
    public setInstrumentador(value: string | undefined) { this.instrumentador = value; }

    public getRiesgoQuirurgico() { return this.riesgo_quirurgico; }
    public setRiesgoQuirurgico(value: "bajo" | "mediano" | "alto") { this.riesgo_quirurgico = value; }

    public getDiagnosticoPreoperatorio() { return this.diagnostico_preoperatorio; }
    public setDiagnosticoPreoperatorio(value: string) { this.diagnostico_preoperatorio = value; }

    public getPlanQuirurgico() { return this.plan_quirurgico; }
    public setPlanQuirurgico(value: string) { this.plan_quirurgico = value; }

    public getDiagnosticoPostoperatorio() { return this.diagnostico_postoperatorio; }
    public setDiagnosticoPostoperatorio(value: string) { this.diagnostico_postoperatorio = value; }

    public getOperacionRealizada() { return this.operacion_realizada; }
    public setOperacionRealizada(value: string) { this.operacion_realizada = value; }

    public getAnatomiaPatologica() { return this.anatomia_patologica; }
    public setAnatomiaPatologica(value: string | undefined) { this.anatomia_patologica = value; }

    public getDescripcionTecnica() { return this.descripcion_tecnica; }
    public setDescripcionTecnica(value: string) { this.descripcion_tecnica = value; }

    public getMedicoResponsable() { return this.medico_responsable; }
    public setMedicoResponsable(value: string) { this.medico_responsable = value; }

    public getMedicoResponsableNombre() { return this.medico_responsable_nombre; }
    public setMedicoResponsableNombre(value: string) { this.medico_responsable_nombre = value; }
}