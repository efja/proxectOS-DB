// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";

import { User } from './user.model';
import { UserGroup } from './user-group.model';

// ####################################################################################################
// ## CLASE CommentApp
// ####################################################################################################
@Entity()
export class CommentApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public expirationDate?      : Date;

    @Property()
    public title                : string;
    @Property()
    public message              : string;

    // Relacións
    @ManyToOne()
    public createdBy            : User;

    @ManyToMany(() => UserGroup)
    public visibleToUserGroups  : Collection<UserGroup> = new Collection<UserGroup>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<CommentApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
