// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, ManyToOne, ManyToMany, Property } from '@mikro-orm/core';

import { AssignedRolesToUser } from './assigned-roles-user.model';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { User } from './user.model';
import { State } from "./state.model";
import { Stage } from './stage.model';

// ####################################################################################################
// ## CLASE AssignedPermissions
// ####################################################################################################
@Entity()
export class AssignedStages extends BaseEntity {
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

    // Relacións
    @ManyToOne()
    public createdBy        : User;

    @ManyToOne()
    public stage            : Stage;

    @ManyToOne()
    public currentState     : State;

    @ManyToMany(() => AssignedRolesToUser)
    public assignedUsers    : Collection<AssignedRolesToUser> = new Collection<AssignedRolesToUser>(this);
    @ManyToMany(() => User)
    public validatingUsers  : Collection<User> = new Collection<User>(this);

    @ManyToMany(() => CommentApp)
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<AssignedStages>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
