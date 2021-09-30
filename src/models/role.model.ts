// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToMany, OneToMany, Enum, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
import { PerformanceApp } from './performanceapp.model';
import { Permissions } from "./permissions.model";
import { Project } from './project.model';
import { RepositoryApp } from './repositoryapp.model';
import { Requirement } from './requirement.model';
import { Stage } from './stage.model';
import { StateHistory } from './state-history.model';

// ####################################################################################################
// ## ENUMS
// ####################################################################################################
export enum TargetRole {
    PERFORMANCE,
    PROJECT,
    REQUIREMENT,
    STAGE,
    STATE,
    SYSTEM,
}

// ####################################################################################################
// ## CLASE Role
// ####################################################################################################
@Entity()
export class Role extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    @Unique()
    public name         : string;
    @Property()
    public description  : string;
    @Property()
    public scope        : string;

    @Enum({ items: () => TargetRole, array: true, nullable: false })
    public TargetRole   : TargetRole[];

    // Relacións
    @ManyToMany(() => Permissions)
    public permissions  : Collection<Permissions> = new Collection<Permissions>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Role>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
