// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Entity, Property } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { UserContactType } from './user-contact-type.model';

// ####################################################################################################
// ## CLASE UserContact
// ####################################################################################################
@Entity()
export class UserContact extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public type    : UserContactType;
    @Property()
    public contact : string;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<UserContact>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
