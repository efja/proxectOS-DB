// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { AssignedRolesToUser } from './assigned-roles-user.model';
import { BaseEntity } from "./base-entity.model";
import { RepositoryApp } from './repositoryapp.model';
import { Requirement } from './requirement.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { User } from './user.model';
import { CommentApp } from './commentapp.model';

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

    @ManyToMany(() => AssignedRolesToUser)
    public assignedUsers    : Collection<AssignedRolesToUser> = new Collection<AssignedRolesToUser>(this);

    @ManyToOne()
    public createdBy        : User;
    @ManyToMany(() => User)
    public validatingUsers  : Collection<User> = new Collection<User>(this);


    @ManyToMany(() => Requirement)
    public requirements     : Collection<Requirement> = new Collection<Requirement>(this);

    @ManyToMany(() => RepositoryApp)
    public repositories     : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    @ManyToMany(() => CommentApp)
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

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
