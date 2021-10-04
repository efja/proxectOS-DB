// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { AssignedRolesToUser } from './assigned-roles-user.model';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { User } from "./user.model";

// ####################################################################################################
// ## CLASE RepositoryApp
// ####################################################################################################@Entity()
@Entity()
export class RepositoryApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public expirationDate?  : Date;

    @Property()
    public name             : string;
    @Property()
    public description      : string;
    @Property()
    @Unique()
    public uri              : string;

    // Relacións
    @ManyToOne()
    public createdBy        : User;

    @ManyToMany(() => AssignedRolesToUser)
    public assignedUsers    : Collection<AssignedRolesToUser> = new Collection<AssignedRolesToUser>(this);

    @ManyToMany(() => CommentApp)
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<RepositoryApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
