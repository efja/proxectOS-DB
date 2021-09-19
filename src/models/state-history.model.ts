// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Performance } from './performance.model';
import { Project } from './project.model';
import { Requirement } from './requirement.model';
import { Role } from './role.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE StateHistory
// ####################################################################################################
export class StateHistory {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    public id               : string;

    public creationDate : string;
    public log          : string;

    // Relacións
    public oldState     : State;
    public newState     : State;

    public targetRoles  : Role[];

    public createdBy    : User;

    public project?     : Project;
    public performance? : Performance;
    public requirement? : Requirement;
    public stage?       : Stage;

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<StateHistory>) {
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
