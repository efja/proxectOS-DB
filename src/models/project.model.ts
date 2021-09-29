// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";

import { RepositoryApp } from './repositoryapp.model';
import { Requirement } from './requirement.model';
import { Role } from './role.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { User } from './user.model';
import { CommentApp } from './commentapp.model';
import { StateHistory } from './state-history.model';

// ####################################################################################################
// ## CLASE Project
// ####################################################################################################
@Entity()
export class Project extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public startDate        : Date;
    @Property()
    public finishDate       : Date;
    @Property()
    public targetStartDate  : Date;
    @Property()
    public targetFinishDate : Date;

    @Property()
    @Unique()
    public name             : string;
    @Property()
    public description      : string;

    // Relacións
    @ManyToOne()
    public currentStage     : Stage;
    @ManyToOne()
    public currentState     : State;

    @ManyToMany()
    public assignedRoles    : Collection<Role> = new Collection<Role>(this);

    @ManyToOne()
    public createdBy        : User;
    @ManyToMany()
    public assignedUsers    : Collection<User> = new Collection<User>(this);
    @ManyToMany()
    public validatingUsers  : Collection<User> = new Collection<User>(this);


    @ManyToMany()
    public requirements     : Collection<Requirement> = new Collection<Requirement>(this);

    @ManyToMany()
    public repositories     : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    @ManyToMany()
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // project
    @OneToMany(() => StateHistory, s => s.project)
    projectsStateHistories  : Collection<StateHistory>= new Collection<StateHistory>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Project>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
