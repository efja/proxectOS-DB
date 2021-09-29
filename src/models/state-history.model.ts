// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";

import { PerformanceApp } from './performanceapp.model';
import { Project } from './project.model';
import { Requirement } from './requirement.model';
import { Role } from './role.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE StateHistory
// ####################################################################################################
@Entity()
export class StateHistory extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public log          : string;

    // Relacións
    @ManyToOne()
    public oldState     : State;
    @ManyToOne()
    public newState     : State;

    @ManyToMany()
    public targetRoles  : Collection<Role> = new Collection<Role>(this);

    @ManyToOne()
    public createdBy    : User;

    @ManyToOne()
    public project?     : Project;
    @ManyToOne()
    public performance? : PerformanceApp;
    @ManyToOne()
    public requirement? : Requirement;
    @ManyToOne()
    public stage?       : Stage;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<StateHistory>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
