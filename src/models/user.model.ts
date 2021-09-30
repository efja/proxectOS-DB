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

    @Property()
    public vacantions       : Date[];

    // Relacións
    @ManyToOne()
    public userSchedule     : UserSchedule;
    @ManyToMany(() => UserContact)
    public contacts         : Collection<UserContact> = new Collection<UserContact>(this);
    @ManyToMany(() => Role)
    public roles            : Collection<Role> = new Collection<Role>(this);

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
