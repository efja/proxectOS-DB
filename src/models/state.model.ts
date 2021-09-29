// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { PerformanceApp } from './performanceapp.model';
import { Project } from './project.model';
import { Requirement } from './requirement.model';
import { StateHistory } from './state-history.model';

// ####################################################################################################
// ## CLASE State
// ####################################################################################################
@Entity()
export class State extends BaseEntity {
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
    // currentState
    @OneToMany(() => PerformanceApp, p => p.currentState)
    currentStatesPerformances   : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Project, p => p.currentState)
    currentStatesProjects       : Collection<Project>= new Collection<Project>(this);
    @OneToMany(() => Requirement, r => r.currentState)
    currentStatesRequirements   : Collection<Requirement>= new Collection<Requirement>(this);

    // oldState
    @OneToMany(() => StateHistory, s => s.oldState)
    oldStatesStateHistories : Collection<StateHistory>= new Collection<StateHistory>(this);

    // newState
    @OneToMany(() => StateHistory, s => s.newState)
    newStatesStateHistories : Collection<StateHistory>= new Collection<StateHistory>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<State>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
