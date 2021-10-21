// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { AssignedResource } from './assigned-resource.model';
import { AssignedUser } from './assigned-user.model';
import { AssignedStage } from './assigned-stage.model';
import { CommentApp } from './commentapp.model';
import { Priority } from './priority.model';
import { Type } from './type.model';
import { User } from './user.model';
import { UserGroup } from './user-group.model';

// ####################################################################################################
// ## CLASE PerformanceApp
// ####################################################################################################
@Entity()
export class PerformanceApp extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public startDate?               : Date;
    @Property()
    public finishDate?              : Date;
    @Property()
    public targetStartDate?         : Date;
    @Property()
    public targetFinishDate?        : Date;

    @Property()
    public name                     : string;
    @Property()
    public description              : string;

    // Relacións
    @ManyToMany(() => PerformanceApp)
    public performances             : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);

    @ManyToMany(() => AssignedStage)
    public assignedStages           : Collection<AssignedStage> = new Collection<AssignedStage>(this);

    @ManyToOne()
    public priority                 : Priority;
    @ManyToOne()
    public type                     : Type;

    @ManyToOne()
    public createdBy                : User;

    @ManyToMany(() => AssignedUser)
    public assignedUsers            : Collection<AssignedUser> = new Collection<AssignedUser>(this);

    @ManyToMany(() => UserGroup)
    public visibleToUserGroups      : Collection<UserGroup> = new Collection<UserGroup>(this);

    @ManyToMany(() => AssignedResource)
    public estimatedResources       : Collection<AssignedResource> = new Collection<AssignedResource>(this);
    @ManyToMany(() => AssignedResource)
    public resourcesConsumed        : Collection<AssignedResource> = new Collection<AssignedResource>(this);

    @ManyToMany(() => CommentApp)
    public comments                 : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<PerformanceApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
