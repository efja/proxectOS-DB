// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { AssignedUser } from './assigned-user.model';
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

    @ManyToMany(() => AssignedUser)
    public assignedUsers    : Collection<AssignedUser> = new Collection<AssignedUser>(this);

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
