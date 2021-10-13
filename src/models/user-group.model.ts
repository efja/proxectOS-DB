// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { UserContact } from "./user-contact.model";
import { User } from './user.model';
import { Role } from './role.model';

// ####################################################################################################
// ## CLASE User
// ####################################################################################################
@Entity()
export class UserGroup extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    @Unique()
    public name         : string;
    @Property()
    public description  : string;

    // Relacións
    @ManyToMany(() => Role)
    public defaultRoles     : Collection<Role> = new Collection<Role>(this);

    // @ManyToMany(() => User)
    // public users        : Collection<User> = new Collection<User>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<UserGroup>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
