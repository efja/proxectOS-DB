// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { AssignedStage } from './assigned-stage.model';
import { AssignedUser } from './assigned-user.model';
import { CommentApp } from './commentapp.model';
import { RepositoryApp } from './repositoryapp.model';
import { Requirement } from './requirement.model';
import { User } from './user.model';

// ##################################################################################################
// ## CLASE Project
// ##################################################################################################
@Entity()
export class Project extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public startDate?           : Date;
    @Property()
    public finishDate?          : Date;
    @Property()
    public targetStartDate?     : Date;
    @Property()
    public targetFinishDate?    : Date;

    @Property()
    @Unique()
    public name                 : string;
    @Property()
    public description          : string;

    // Relacións
    @ManyToOne()
    public assignedStage        : AssignedStage;

    @ManyToOne()
    public createdBy            : User;

    @ManyToMany(() => AssignedUser)
    public assignedUsers        : Collection<AssignedUser> = new Collection<AssignedUser>(this);

    @ManyToOne()
    public productOwner         : User;

    @ManyToMany(() => Requirement)
    public requirements         : Collection<Requirement> = new Collection<Requirement>(this);

    @ManyToMany(() => RepositoryApp)
    public repositories         : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    @ManyToMany(() => CommentApp)
    public comments             : Collection<CommentApp> = new Collection<CommentApp>(this);

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
