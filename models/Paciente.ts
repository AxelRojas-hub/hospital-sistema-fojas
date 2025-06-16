export class Paciente {
    private id: string;
    private nombre: string;
    private num_historia_clinica: string;
    private fecha_nacimiento: Date;
    private genero: string;
    private direccion: string;
    private telefono: string;
    private dni: string;

    constructor(
        id: string,
        nombre: string,
        num_historia_clinica: string,
        fecha_nacimiento: Date,
        genero: string,
        direccion: string,
        telefono: string,
        dni: string
    ) {
        this.id = id;
        this.nombre = nombre;
        this.num_historia_clinica = num_historia_clinica;
        this.fecha_nacimiento = fecha_nacimiento;
        this.genero = genero;
        this.direccion = direccion;
        this.telefono = telefono;
        this.dni = dni;
    }

    // Getters
    getId(): string {
        return this.id;
    }
    getNombre(): string {
        return this.nombre;
    }
    getNumHistoriaClinica(): string {
        return this.num_historia_clinica;
    }
    getFechaNacimiento(): Date {
        return this.fecha_nacimiento;
    }
    getGenero(): string {
        return this.genero;
    }
    getDireccion(): string {
        return this.direccion;
    }
    getTelefono(): string {
        return this.telefono;
    }
    getDni(): string {
        return this.dni;
    }

    // Setters
    setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    setNumHistoriaClinica(num: string): void {
        this.num_historia_clinica = num;
    }
    setFechaNacimiento(fecha: Date): void {
        this.fecha_nacimiento = fecha;
    }
    setGenero(genero: string): void {
        this.genero = genero;
    }
    setDireccion(direccion: string): void {
        this.direccion = direccion;
    }
    setTelefono(telefono: string): void {
        this.telefono = telefono;
    }
    setDni(dni: string): void {
        this.dni = dni;
    }
}
