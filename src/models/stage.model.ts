// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { Role } from "./role.model";
import { State } from "./state.model";
import { User } from "./user.model";

// ####################################################################################################
// ## CLASE Stage
// ####################################################################################################
@Entity()
export class Stage extends BaseEntity {
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
    public name             : string;
    @Property()
    public description      : string;

    // Relacións
    @ManyToOne()
    public currentState     : State;

    @ManyToMany(() => Role)
    public assignedRoles    : Collection<Role> = new Collection<Role>(this);

    @ManyToOne()
    public createdBy        : User;
    @ManyToMany(() => User)
    public assignedUsers    : Collection<User> = new Collection<User>(this);
    @ManyToMany(() => User)
    public validatingUsers  : Collection<User> = new Collection<User>(this);

    @ManyToMany(() => CommentApp)
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Stage>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
