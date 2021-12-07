// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Enum } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { CommentApp } from './commentapp.model';
import { User } from './user.model';

// ##################################################################################################
// ## ENUMS
// ##################################################################################################
export enum ResourceScale {
    HOUR,
    DAY,
    WEEK,
    UNIT,
}

// ##################################################################################################
// ## CLASE Resource
// ##################################################################################################
@Entity()
export class Resource extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public name         : string;
    @Property()
    public description  : string;

    @Enum({ items: () => ResourceScale, array: false, default: ResourceScale.HOUR })
    public scale        : ResourceScale.HOUR;

    @Property()
    public unitCost     : number;

    // Relacións
    @ManyToOne()
    public createdBy    : User;

    @ManyToMany(() => CommentApp)
    public comments     : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Resource>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
