// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { PerformanceApp } from './performanceapp.model';
import { Requirement } from './requirement.model';

// ####################################################################################################
// ## CLASE Priority
// ####################################################################################################
@Entity()
export class Priority extends BaseEntity {
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
    // priority
    @OneToMany(() => PerformanceApp, p => p.priority)
    prioritiesPerformances  : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.priority)
    prioritiesRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Priority>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
