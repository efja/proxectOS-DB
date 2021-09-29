// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { PerformanceApp } from './performanceapp.model';
import { Requirement } from './requirement.model';

// ####################################################################################################
// ## CLASE Type
// ####################################################################################################
@Entity()
export class Type extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public name         : string;
    @Property()
    public description  : string;

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // type
    @OneToMany(() => PerformanceApp, p => p.type)
    typesPerformances   : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.type)
    typesRequirements   : Collection<Requirement>= new Collection<Requirement>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Type>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
