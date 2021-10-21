// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { AssignedUser } from './assigned-user.model';
import { CommentApp } from './commentapp.model';
import { PerformanceApp } from './performanceapp.model';
import { Priority } from "./priority.model";
import { RepositoryApp } from "./repositoryapp.model";
import { Type } from "./type.model";
import { User } from "./user.model";

// ####################################################################################################
// ## CLASE Requirement
// ####################################################################################################
@Entity()
export class Requirement extends CustomBaseEntity {
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
    public name                 : string;
    @Property()
    public description          : string;

    // Relacións
    @ManyToOne()
    public priority             : Priority;
    @ManyToOne()
    public type                 : Type;

    @ManyToOne()
    public createdBy            : User;

    @ManyToMany(() => AssignedUser)
    public adminUsers           : Collection<AssignedUser> = new Collection<AssignedUser>(this);

    @ManyToMany(() => PerformanceApp)
    public performances         : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);

    @ManyToMany(() => RepositoryApp)
    public repositories         : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    @ManyToMany(() => CommentApp)
    public comments             : Collection<CommentApp> = new Collection<CommentApp>(this);

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
