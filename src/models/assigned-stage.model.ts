// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, ManyToOne, ManyToMany, Property } from '@mikro-orm/core';

import { CustomBaseEntity } from "./base-entity.model";

import { CommentApp } from './commentapp.model';
import { User } from './user.model';
import { Stage } from './stage.model';
import { State } from "./state.model";

// ####################################################################################################
// ## CLASE AssignedPermissions
// ####################################################################################################
@Entity()
export class AssignedStage extends CustomBaseEntity {
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

    // Relacións
    @ManyToOne()
    public createdBy            : User;

    @ManyToOne()
    public stage                : Stage;

    @ManyToOne()
    public currentState         : State;

    @ManyToMany(() => User)
    public validationUsers      : Collection<User> = new Collection<User>(this);

    @ManyToMany(() => CommentApp)
    public comments             : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<AssignedStage>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
