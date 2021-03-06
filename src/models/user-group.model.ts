// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Collection, Entity, Property, ManyToMany, Unique } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { Role } from './role.model';

// ##################################################################################################
// ## CLASE User
// ##################################################################################################
@Entity()
export class UserGroup extends CustomBaseEntity {
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
    public defaultRoles : Collection<Role> = new Collection<Role>(this);

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
