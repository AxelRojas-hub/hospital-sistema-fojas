import { Internacion } from './Internacion';

export class HistoriaClinica {
    private internaciones: Internacion[];
    private consultas: string;
    private antecedentes: string;
    private alergias: string;

    constructor(
        internaciones: Internacion[] = [],
        consultas: string = '',
        antecedentes: string = '',
        alergias: string = ''
    ) {
        this.internaciones = internaciones;
        this.consultas = consultas;
        this.antecedentes = antecedentes;
        this.alergias = alergias;
    }

    // Getters
    getInternaciones(): Internacion[] {
        return this.internaciones;
    }
    getConsultas(): string {
        return this.consultas;
    }
    getAntecedentes(): string {
        return this.antecedentes;
    }
    getAlergias(): string {
        return this.alergias;
    }

    // Setters
    setInternaciones(internaciones: Internacion[]): void {
        this.internaciones = internaciones;
    }
    setConsultas(consultas: string): void {
        this.consultas = consultas;
    }
    setAntecedentes(antecedentes: string): void {
        this.antecedentes = antecedentes;
    }
    setAlergias(alergias: string): void {
        this.alergias = alergias;
    }
}