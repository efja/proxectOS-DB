// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { UserContactType } from './user-contact-type.model';

// ####################################################################################################
// ## CLASE UserContact
// ####################################################################################################
@Entity()
export class UserContact extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @ManyToOne()
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
