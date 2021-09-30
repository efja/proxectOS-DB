// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany, Unique } from '@mikro-orm/core';
import { BaseEntity } from "./base-entity.model";
import { CommentApp } from './commentapp.model';
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
    @ManyToMany(() => Role)
    public targetRoles      : Collection<Role> = new Collection<Role>(this);

    @ManyToMany(() => CommentApp)
    public comments         : Collection<CommentApp> = new Collection<CommentApp>(this);

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
