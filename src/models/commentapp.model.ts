// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { Role } from './role.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE CommentApp
// ####################################################################################################
@Entity()
export class CommentApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public expirationDate?  : Date;

    @Property()
    public title            : string;
    @Property()
    public message          : string;

    // Relacións
    @ManyToOne()
    public createdBy        : User;
    @ManyToMany(() => Role)
    public targetRoles      : Collection<Role> = new Collection<Role>(this);

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
