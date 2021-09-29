// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";

import { PerformanceApp } from './performanceapp.model';
import { Priority } from "./priority.model";
import { RepositoryApp } from "./repositoryapp.model";
import { ResourcesEstimation } from "./resoruces-estimation.model";
import { Role } from "./role.model";
import { Stage } from "./stage.model";
import { State } from "./state.model";
import { Type } from "./type.model";
import { User } from "./user.model";
import { CommentApp } from './commentapp.model';
import { Project } from './project.model';
import { StateHistory } from './state-history.model';

// ####################################################################################################
// ## CLASE Requirement
// ####################################################################################################
@Entity()
export class Requirement extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public startDate                : Date;
    @Property()
    public finishDate               : Date;
    @Property()
    public targetStartDate          : Date;
    @Property()
    public targetFinishDate         : Date;

    @Property()
    public name                     : string;
    @Property()
    public description              : string;

    @Property()
    public totalEstimatedHours      : number;
    @Property()
    public totalHoursConsumed       : number;

    @Property()
    public totalEstimatedResources  : number;
    @Property()
    public totalResourcesConsumed   : number;

    // Relacións
    @ManyToOne()
    public currentStage             : Stage;
    @ManyToOne()
    public currentState             : State;
    @ManyToOne()
    public priority                 : Priority;
    @ManyToOne()
    public type                     : Type;

    @ManyToMany()
    public assignedRoles            : Collection<Role> = new Collection<Role>(this);

    @ManyToOne()
    public createdBy                : User;
    @ManyToMany()
    public assignedUsers            : Collection<User> = new Collection<User>(this);
    @ManyToMany()
    public validatingUsers          : Collection<User> = new Collection<User>(this);

    @ManyToOne()
    public estimatedHours           : ResourcesEstimation;
    @ManyToOne()
    public hoursConsumed            : ResourcesEstimation;

    @ManyToOne()
    public estimatedResources       : ResourcesEstimation;
    @ManyToOne()
    public resourcesConsumed        : ResourcesEstimation;

    @ManyToMany()
    public performances             : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);

    @ManyToMany()
    public repositories             : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    @ManyToMany()
    public comments                 : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // requirements
    @ManyToMany(() => Project, p => p.requirements)
    requirementsProjects    : Collection<Project>= new Collection<Project>(this);
    @OneToMany(() => StateHistory, s => s.requirement)
    requirementsStateHistories  : Collection<StateHistory>= new Collection<StateHistory>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Requirement>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
