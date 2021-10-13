// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, ManyToOne, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { Role } from './role.model';
import { UserGroup } from './user-group.model';
import { User } from './user.model';


// ####################################################################################################
// ## CLASE AssignedPermissions
// ####################################################################################################
@Entity()
export class AssignedUser extends BaseEntity {
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
