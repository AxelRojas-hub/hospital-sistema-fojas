export class Empleado {
    private _habilitado: boolean;
    private _rol: string;
    private _nombre: string; // nombre completo
    private _email: string;
    private _dni: string;

    constructor({
        habilitado,
        rol,
        nombre,
        email,
        dni,
    }: {
        habilitado: boolean;
        rol: string;
        nombre: string; // nombre completo
        email: string;
        dni: string;
    }) {
        this._habilitado = habilitado;
        this._rol = rol;
        this._nombre = nombre;
        this._email = email;
        this._dni = dni;
    }
    static fromUser(user: {
        id: string;
        rol: "MedicoJefe" | "Medico" | "Enfermero" | "Administrador";
        nombre: string;
        email: string;
        habilitado?: boolean;
        dni?: string;
    }) {
        return new Empleado({
            habilitado: user.habilitado ?? true,
            rol: user.rol,
            nombre: user.nombre,
            email: user.email,
            dni: user.dni ?? "",
        });
    }
    get habilitado() {
        return this._habilitado;
    }
    set habilitado(value: boolean) {
        this._habilitado = value;
    }

    get rol() {
        return this._rol;
    }
    set rol(value: string) {
        this._rol = value;
    }

    get nombre() {
        return this._nombre;
    }
    set nombre(value: string) {
        this._nombre = value;
    }

    get email() {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }

    get dni() {
        return this._dni;
    }
    set dni(value: string) {
        this._dni = value;
    }

    estaHabilitado() {
        return this._habilitado;
    }

    esAdministrador() {
        return this._rol === "Administrador";
    }

    nombreCompleto() {
        return this._nombre;
    }
}