// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Collection, Entity, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { Role } from './role.model';
import { User } from './user.model';
import { UserGroup } from './user-group.model';

// ##################################################################################################
// ## CLASE AssignedPermissions
// ##################################################################################################
@Entity()
export class AssignedUser extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    // Relacións
    @ManyToOne()
    public createdBy            : User;

    @ManyToOne()
    public assignedUser         : User;
    @ManyToMany(() => Role)
    public assignedRoles        : Collection<Role> = new Collection<Role>(this);
    @ManyToMany(() => UserGroup)
    public assignedUserGroups   : Collection<UserGroup> = new Collection<UserGroup>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<AssignedUser>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
