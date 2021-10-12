// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany } from '@mikro-orm/core';

import { AssignedRolesToUser } from './assigned-roles-user.model';
import { AssignedStages } from './assigned-stages.model';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { Priority } from './priority.model';
import { ResourcesEstimation } from './resoruces-estimation.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { Type } from './type.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE PerformanceApp
// ####################################################################################################
@Entity()
export class PerformanceApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public startDate                : Date;
    @Property()
    public finishDate               : Date;
    @Property()
    public targetStartDate          : Date;
    @Property()
    public targetFinishDate         : Date;

    @Property()
    public name                     : string;
    @Property()
    public description              : string;

    @Property()
    public totalEstimatedHours      : number;
    @Property()
    public totalHoursConsumed       : number;

    @Property()
    public totalEstimatedResources  : number;
    @Property()
    public totalResourcesConsumed   : number;

    // Relacións
    @ManyToMany(() => PerformanceApp)
    public performances             : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);

    @ManyToMany(() => AssignedStages)
    public stages                   : Collection<AssignedStages> = new Collection<AssignedStages>(this);

    @ManyToOne()
    public priority                 : Priority;
    @ManyToOne()
    public type                     : Type;

    @ManyToMany(() => AssignedRolesToUser)
    public assignedUsers            : Collection<AssignedRolesToUser> = new Collection<AssignedRolesToUser>(this);

    @ManyToOne()
    public createdBy                : User;
    public validatingUsers          : Collection<User> = new Collection<User>(this);

    @ManyToMany(() => ResourcesEstimation)
    public estimatedHours           : Collection<ResourcesEstimation> = new Collection<ResourcesEstimation>(this);
    @ManyToMany(() => ResourcesEstimation)
    public hoursConsumed            : Collection<ResourcesEstimation> = new Collection<ResourcesEstimation>(this);

    @ManyToMany(() => ResourcesEstimation)
    public estimatedResources       : Collection<ResourcesEstimation> = new Collection<ResourcesEstimation>(this);
    @ManyToMany(() => ResourcesEstimation)
    public resourcesConsumed        : Collection<ResourcesEstimation> = new Collection<ResourcesEstimation>(this);

    @ManyToMany(() => CommentApp)
    public comments                 : Collection<CommentApp> = new Collection<CommentApp>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<PerformanceApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
