// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Collection, Entity, Property, ManyToOne, ManyToMany } from '@mikro-orm/core';

import { CustomBaseEntity } from "./custom-base-entity.model";

import { AssignedStage } from './assigned-stage.model';
import { Role } from './role.model';
import { State } from './state.model';
import { User } from './user.model';

// ##################################################################################################
// ## CLASE StateHistory
// ##################################################################################################
@Entity()
export class StateHistory extends CustomBaseEntity {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    @Property()
    public log                  : string;

    // Relacións
    @ManyToOne()
    public oldState?            : State;
    @ManyToOne()
    public newState             : State;

    @ManyToOne()
    public createdBy            : User;

    @ManyToMany(() => Role)
    public visibleToUserGroups  : Collection<Role> = new Collection<Role>(this);

    @ManyToOne()
    public assignedState        : AssignedStage;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<StateHistory>) {
        super();
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
