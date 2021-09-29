// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { Project } from './project.model';
import { Requirement } from './requirement.model';

import { Role } from "./role.model";
import { User } from "./user.model";

// ####################################################################################################
// ## CLASE RepositoryApp
// ####################################################################################################@Entity()
@Entity()
export class RepositoryApp extends BaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public expirationDate?  : Date;

    @Property()
    public name             : string;
    @Property()
    public description      : string;
    @Property()
    @Unique()
    public uri              : string;

    // Relacións
    @ManyToOne()
    public createdBy        : User;
    @ManyToMany()
    public targetRoles      : Collection<Role> = new Collection<Role>(this);

    // ************************************************************************************************
    // ** Propiedades de navegación
    // ************************************************************************************************
    // Repositories
    @ManyToMany(() => Project, p => p.repositories)
    repositoriesProjects  : Collection<Project>= new Collection<Project>(this);
    @ManyToMany(() => Requirement, r => r.repositories)
    repositoriesRequirements  : Collection<Requirement>= new Collection<Requirement>(this);

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<RepositoryApp>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
