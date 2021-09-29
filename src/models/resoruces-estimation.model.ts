// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany, Enum } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
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

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // estimatedHours
    @OneToMany(() => PerformanceApp, p => p.estimatedHours)
    estimatedHoursPerformances  : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.estimatedHours)
    estimatedHoursRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

    // hoursConsumed
    @OneToMany(() => PerformanceApp, p => p.hoursConsumed)
    hoursConsumedPerformances  : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.hoursConsumed)
    hoursConsumedRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

    // estimatedResources
    @OneToMany(() => PerformanceApp, p => p.estimatedResources)
    estimatedResourcesPerformances  : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.estimatedResources)
    estimatedResourcesRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

    // resourcesConsumed
    @OneToMany(() => PerformanceApp, p => p.resourcesConsumed)
    resourcesConsumedPerformances  : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Requirement, r => r.resourcesConsumed)
    resourcesConsumedRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

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
