// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Entity, Property } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

// ####################################################################################################
// ## CLASE Type
// ####################################################################################################
@Entity()
export class Type extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public name         : string;
    @Property()
    public description  : string;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Type>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
