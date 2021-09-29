// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, OneToMany, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";

import { UserContact } from "./user-contact.model";
import { UserSchedule } from './user-schedule.model';
import { Role } from './role.model';
import { CommentApp } from './commentapp.model';
import { Project } from './project.model';
import { RepositoryApp } from './repositoryapp.model';
import { Requirement } from './requirement.model';
import { ResourcesEstimation } from './resoruces-estimation.model';
import { StateHistory } from './state-history.model';
import { PerformanceApp } from './performanceapp.model';
import { Stage } from './stage.model';

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
    public salary           : number;
    @Property()
    public flexibleSchedule : boolean;

    @Property()
    @Unique()
    public login            : string;
    @Property()
    public password         : string;

    // Relacións
    @ManyToOne()
    public userSchedule     : UserSchedule;
    @ManyToMany()
    public contacts         : Collection<UserContact> = new Collection<UserContact>(this);
    @ManyToMany()
    public roles            : Collection<Role> = new Collection<Role>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // createdBy
    @OneToMany(() => CommentApp, c => c.createdBy)
    createdByComments                : Collection<CommentApp>= new Collection<CommentApp>(this);
    @OneToMany(() => PerformanceApp, p => p.createdBy)
    createdByPerformances            : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @OneToMany(() => Project, p => p.createdBy)
    createdByProjects                : Collection<Project>= new Collection<Project>(this);
    @OneToMany(() => RepositoryApp, r => r.createdBy)
    createdByRepositories            : Collection<RepositoryApp>= new Collection<RepositoryApp>(this);
    @OneToMany(() => Requirement, r => r.createdBy)
    createdByRequirements            : Collection<Requirement>= new Collection<Requirement>(this);
    @OneToMany(() => ResourcesEstimation, r => r.createdBy)
    createdByResourcesEstimations    : Collection<ResourcesEstimation>= new Collection<ResourcesEstimation>(this);
    @OneToMany(() => Stage, s => s.createdBy)
    createdByStages                  : Collection<Stage>= new Collection<Stage>(this);
    @OneToMany(() => StateHistory, s => s.createdBy)
    createdByStateHistories          : Collection<StateHistory>= new Collection<StateHistory>(this);

    // assignedUsers
    @ManyToMany(() => PerformanceApp, p => p.assignedUsers)
    assignedUsersPerformances   : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);
    @ManyToMany(() => Project, p => p.assignedUsers)
    assignedUsersProjects       : Collection<Project> = new Collection<Project>(this);
    @ManyToMany(() => Requirement, r => r.assignedUsers)
    assignedUsersRequirements   : Collection<Requirement> = new Collection<Requirement>(this);
    @ManyToMany(() => Stage, s => s.assignedUsers)
    assignedUsersStages         : Collection<Stage> = new Collection<Stage>(this);

    // validatingUsers
    @ManyToMany(() => PerformanceApp, p => p.validatingUsers)
    validatingUsersPerformances : Collection<PerformanceApp> = new Collection<PerformanceApp>(this);
    @ManyToMany(() => Project, p => p.validatingUsers)
    validatingUsersProjects     : Collection<Project> = new Collection<Project>(this);
    @ManyToMany(() => Requirement, r => r.validatingUsers)
    validatingUsersRequirements : Collection<Requirement> = new Collection<Requirement>(this);
    @ManyToMany(() => Stage, s => s.validatingUsers)
    validatingUsersStages       : Collection<Stage> = new Collection<Stage>(this);

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
