// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { UserContact } from "./user-contact.model";
import { UserSchedule } from './user-schedule.model';
import { Role } from './role.model';

// ####################################################################################################
// ## CLASE User
// ####################################################################################################
@Entity()
export class User extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public name             : string;
    @Property()
    public firstSurname     : string;
    @Property()
    public secondSurname    : string;

    @Property()
    @Unique()
    public login            : string;
    @Property()
    public password         : string;

    @Property()
    public salary           : number;
    @Property()
    public flexibleSchedule : boolean;
    @Property()
    public vacantions       : Date[];

    // Relacións
    @ManyToOne()
    public userSchedule     : UserSchedule;
    @ManyToMany(() => UserContact)
    public contacts         : Collection<UserContact> = new Collection<UserContact>(this);

    @ManyToMany(() => Role)
    public defaultRoles     : Collection<Role> = new Collection<Role>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<User>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
