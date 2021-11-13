// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { AssignedUser } from './assigned-user.model';
import { CommentApp } from './commentapp.model';
import { Priority } from "./priority.model";
import { RepositoryApp } from "./repositoryapp.model";
import { Type } from "./type.model";
import { User } from "./user.model";
import { UserGroup } from './user-group.model';
import { AssignedResource } from './assigned-resource.model';
import { AssignedStage } from './assigned-stage.model';

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

    // Relacións reflexivas
    @ManyToMany(() => Requirement)
    public dependencies         : Collection<Requirement> = new Collection<Requirement>(this);

    // Relacións usuarios
    @ManyToMany(() => AssignedUser)
    public adminUsers           : Collection<AssignedUser> = new Collection<AssignedUser>(this);

    @ManyToMany(() => AssignedUser)
    public assignedUsers        : Collection<AssignedUser> = new Collection<AssignedUser>(this);

    @ManyToOne()
    public createdBy            : User;

    @ManyToMany(() => UserGroup)
    public visibleToUserGroups  : Collection<UserGroup> = new Collection<UserGroup>(this);

    // Relacións recursos
    @ManyToMany(() => AssignedResource)
    public estimatedResources   : Collection<AssignedResource> = new Collection<AssignedResource>(this);

    @ManyToMany(() => AssignedResource)
    public resourcesConsumed    : Collection<AssignedResource> = new Collection<AssignedResource>(this);

    @ManyToMany(() => RepositoryApp)
    public repositories         : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);

    // Relacións
    @ManyToMany(() => AssignedStage)
    public assignedStages       : Collection<AssignedStage> = new Collection<AssignedStage>(this);

    @ManyToMany(() => CommentApp)
    public comments             : Collection<CommentApp> = new Collection<CommentApp>(this);

    @ManyToOne()
    public priority             : Priority;

    @ManyToOne()
    public type                 : Type;

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
