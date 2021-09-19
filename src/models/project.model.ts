// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Repository } from './repository.model';
import { Requirement } from './requirement.model';
import { Role } from './role.model';
import { Stage } from './stage.model';
import { State } from './state.model';
import { User } from './user.model';

// ####################################################################################################
// ## CLASE Project
// ####################################################################################################
export class Project {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    public id               : string;

    public creationDate     : Date;
    public startDate        : Date;
    public finishDate       : Date;
    public targetStartDate  : Date;
    public targetFinishDate : Date;

    public name             : string;
    public description      : string;

    // Relacións
    public stage            : Stage;
    public state            : State;
    public requirements     : Requirement[];

    public assignedRoles    : Role[];

    public assignedUsers    : User[];
    public validatingUsers  : User[];

    public repositories     : Repository[];

    public comments         : Comment[];

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor(obj?: Partial<Project>) {
        Object.assign(this, obj);
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
}
