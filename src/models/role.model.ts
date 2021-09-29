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
    @ManyToMany()
    public permissions  : Collection<Permissions> = new Collection<Permissions>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // assignedRoles
    @ManyToMany(() => PerformanceApp, p => p.assignedRoles)
    assignedRolesPerformances   : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @ManyToMany(() => Project, p => p.assignedRoles)
    assignedRolesProjects       : Collection<Project>= new Collection<Project>(this);
    @ManyToMany(() => Requirement, r => r.assignedRoles)
    assignedRolesRequirements   : Collection<Requirement>= new Collection<Requirement>(this);
    @ManyToMany(() => Stage, s => s.assignedRoles)
    assignedRolesStages         : Collection<Stage>= new Collection<Stage>(this);

    // targetRoles
    @ManyToMany(() => CommentApp, c => c.targetRoles)
    targetRolesComments : Collection<CommentApp> = new Collection<CommentApp>(this);
    @ManyToMany(() => RepositoryApp, r => r.targetRoles)
    targetRolesRepositories : Collection<RepositoryApp> = new Collection<RepositoryApp>(this);
    @ManyToMany(() => StateHistory, s => s.targetRoles)
    targetRolesStateHistories : Collection<StateHistory> = new Collection<StateHistory>(this);

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
