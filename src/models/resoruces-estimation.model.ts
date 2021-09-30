// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany, Enum } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { PerformanceApp } from './performanceapp.model';
import { Requirement } from './requirement.model';
import { User } from './user.model';

// ####################################################################################################
// ## ENUMS
// ####################################################################################################
export enum ResourcesEstimationScale {
    HOURS,
    DAYS,
    WEEKS,
    EURO,
    DOLLAR,
}

// ####################################################################################################
// ## CLASE ResourcesEstimation
// ####################################################################################################
@Entity()
export class ResourcesEstimation extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public name         : string;
    @Property()
    public description  : string;

    @Enum({ items: () => ResourcesEstimationScale, array: false, default: ResourcesEstimationScale.HOURS })
    public scale        : ResourcesEstimationScale.HOURS;
    @Property()
    public amount       : number;
    @Property()
    public cost         : number;

    // Relacións
    @ManyToOne()
    public createdBy    : User;

    @ManyToMany(() => CommentApp)
    public comments     : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<ResourcesEstimation>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
