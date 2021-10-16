// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Enum } from '@mikro-orm/core';

import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { User } from './user.model';
import { Resource } from './resoruces.model';


// ####################################################################################################
// ## CLASE AssignedResources
// ####################################################################################################
@Entity()
export class AssignedResources extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public description  : string;

    @Property()
    public amount       : number;
    @Property()
    public unitCost     : number;

    // Relacións
    @ManyToOne()
    public createdBy    : User;

    @ManyToOne()
    public resource     : Resource;

    @ManyToMany(() => CommentApp)
    public comments     : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<AssignedResources>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
