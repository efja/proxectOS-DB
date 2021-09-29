// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { PerformanceApp } from './performanceapp.model';
import { Project } from './project.model';
import { Requirement } from './requirement.model';

import { Role } from './role.model';
import { Stage } from './stage.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE CommentApp
// ####################################################################################################
@Entity()
export class CommentApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public expirationDate?  : Date;

    @Property()
    public title            : string;
    @Property()
    public message          : string;

    // Relacións
    @ManyToOne()
    public createdBy        : User;
    @ManyToMany()
    public targetRoles      : Collection<Role> = new Collection<Role>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // comments
    @ManyToMany(() => PerformanceApp, c => c.comments)
    commentsPerformances    : Collection<PerformanceApp>= new Collection<PerformanceApp>(this);
    @ManyToMany(() => Project, p => p.comments)
    commentsProjects        : Collection<Project>= new Collection<Project>(this);
    @ManyToMany(() => Requirement, r => r.comments)
    commentsRequirements    : Collection<Requirement>= new Collection<Requirement>(this);
    @ManyToMany(() => Stage, s => s.comments)
    commentsStages          : Collection<Stage>= new Collection<Stage>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<CommentApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
