// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { CustomBaseEntity } from '../../src/models/base-entity.model';

// MODELOS SEN DEPENDENCIAS
import { Priority } from '../../src/models/priority.model';
import { Role } from '../../src/models/role.model';
import { Type } from '../../src/models/type.model';
import { UserContactType } from '../../src/models/user-contact-type.model';
import { UserSchedule } from '../../src/models/user-schedule.model';
import { Stage } from '../../src/models/stage.model';
import { State } from '../../src/models/state.model';

// MODELOS CUNHA SOA DEPENDENCIA
import { Resource } from '../../src/models/resoruces.model';
import { UserContact } from '../../src/models/user-contact.model';
import { UserGroup } from '../../src/models/user-group.model';


// MODELOS CON VARIAS DEPENDENCIAS
import { User } from '../../src/models/user.model';
import { CommentApp } from '../../src/models/commentapp.model';
import { AssignedUser } from '../../src/models/assigned-user.model';
import { AssignedResource } from '../../src/models/assigned-resoruce.model';
import { AssignedStage } from '../../src/models/assigned-stage.model';
import { RepositoryApp } from '../../src/models/repositoryapp.model';
import { PerformanceApp } from '../../src/models/performanceapp.model';
import { Requirement } from '../../src/models/requirement.model';
import { StateHistory } from '../../src/models/state-history.model';
import { Project } from '../../src/models/project.model';
import { Collection } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

// ####################################################################################################
// ## CONSTANTES
// ####################################################################################################
// MODELOS SEN DEPENDENCIAS
const prioritiesJson        = require('./seed/priorities.json');
const rolesJson             = require('./seed/roles.json');
const typesJson             = require('./seed/types.json');
const userContactTypesJson  = require('./seed/user-contact-types.json');
const userSchedulesJson     = require('./seed/user-schedules.json');
const stagesJson            = require('./seed/stages.json');
const statesJson            = require('./seed/states.json');

// MODELOS CUNHA SOA DEPENDENCIA
const resorucesJson         = require('./seed/resoruces.json');
const userContactsJson      = require('./seed/user-contacts.json');
const userGroupsJson        = require('./seed/user-groups.json');

// MODELOS CON VARIAS DEPENDENCIAS
const usersJson             = require('./seed/users.json');
const commentsJson          = require('./seed/comments.json');
const assignedUsersJson     = require('./seed/assigned-users.json');
const assignedResourcesJson = require('./seed/assigned-resoruces.json');
const assignedStagesJson    = require('./seed/assigned-stages.json');
const repositoriesJson      = require('./seed/repositories.json');
const performancesJson      = require('./seed/performances.json');
const requirementsJson      = require('./seed/requirements.json');
const stateHistoryJson      = require('./seed/state-history.json');
const projectsJson          = require('./seed/projects.json');

// MODELOS CUNHA SOA DEPENDENCIA // TODO: valorar se é necesario aínda que para os test non o vexo
// const associationsUserGroupsJson        = require('./seed/array-associations/user-groups.json');

// const associationsusersJson             = require('./seed/array-associations/users.json');
// const associationsCommentsJson          = require('./seed/array-associations/comments.json');
// const associationsAssignedUsersJson     = require('./seed/array-associations/assigned-users.json');
// const associationsAssignedStagesJson    = require('./seed/array-associations/assigned-stages.json');
// const associationsRepositoriesJson      = require('./seed/array-associations/repositories.json');
// const associationsPerformancesJson      = require('./seed/array-associations/performances.json');
// const associationsRequirementsJson      = require('./seed/array-associations/requirements.json');
// const associationsStateHistoryJson      = require('./seed/array-associations/state-history.json');
// const associationsProjectsJson          = require('./seed/array-associations/projects.json');

// ####################################################################################################
// ## UTILIDADES
// ####################################################################################################

export class ObjectFactory {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    // MODELOS SEN DEPENDENCIAS
    priorities          : CustomBaseEntity[] = [];
    roles               : CustomBaseEntity[] = [];
    types               : CustomBaseEntity[] = [];
    UserContactTypes    : CustomBaseEntity[] = [];
    userSchedules       : CustomBaseEntity[] = [];
    stages              : CustomBaseEntity[] = [];
    states              : CustomBaseEntity[] = [];

    // MODELOS CUNHA SOA DEPENDENCIA
    resoruces           : CustomBaseEntity[] = [];
    userContacts        : CustomBaseEntity[] = [];
    userGroups          : CustomBaseEntity[] = [];

    // MODELOS CON VARIAS DEPENDENCIAS
    users               : CustomBaseEntity[] = [];
    comments            : CustomBaseEntity[] = [];
    assignedUsers       : CustomBaseEntity[] = [];
    assignedResources   : CustomBaseEntity[] = [];
    assignedStages      : CustomBaseEntity[] = [];
    repositories        : CustomBaseEntity[] = [];
    performances        : CustomBaseEntity[] = [];
    requirements        : CustomBaseEntity[] = [];
    stateHistory        : CustomBaseEntity[] = [];
    projects            : CustomBaseEntity[] = [];

    // LISTA DE MODELOS
    allModels           : CustomBaseEntity[] = [];

    // ************************************************************************************************
    // ** CONSTRUTOR
    // ************************************************************************************************
    constructor() {
        // MODELOS SEN DEPENDENCIAS
        this.priorities          =  this.parseDataList2AnyEntityList(prioritiesJson, "Priority");
        this.roles               =  this.parseDataList2AnyEntityList(rolesJson, "Role");
        this.types               =  this.parseDataList2AnyEntityList(typesJson, "Type");
        this.UserContactTypes    =  this.parseDataList2AnyEntityList(userContactTypesJson, "UserContactType");
        this.userSchedules       =  this.parseDataList2AnyEntityList(userSchedulesJson, "UserSchedule");
        this.stages              =  this.parseDataList2AnyEntityList(stagesJson, "Stage");
        this.states              =  this.parseDataList2AnyEntityList(statesJson, "State");

        // MODELOS CUNHA SOA DEPENDENCIA
        this.resoruces           =  this.parseDataList2AnyEntityList(resorucesJson, "Resource");
        this.userContacts        =  this.parseDataList2AnyEntityList(userContactsJson, "UserContact");
        this.userGroups          =  this.parseDataList2AnyEntityList(userGroupsJson, "UserGroup");

        // MODELOS CON VARIAS DEPENDENCIAS
        this.users               =  this.parseDataList2AnyEntityList(usersJson, "User");
        this.comments            =  this.parseDataList2AnyEntityList(commentsJson, "CommentApp");
        this.assignedUsers       =  this.parseDataList2AnyEntityList(assignedUsersJson, "AssignedUser");
        this.assignedResources   =  this.parseDataList2AnyEntityList(assignedResourcesJson, "AssignedResource");
        this.assignedStages      =  this.parseDataList2AnyEntityList(assignedStagesJson, "AssignedStage");
        this.repositories        =  this.parseDataList2AnyEntityList(repositoriesJson, "RepositoryApp");
        this.performances        =  this.parseDataList2AnyEntityList(performancesJson, "PerformanceApp");
        this.requirements        =  this.parseDataList2AnyEntityList(requirementsJson, "Requirement");
        this.stateHistory        =  this.parseDataList2AnyEntityList(stateHistoryJson, "StateHistory");
        this.projects            =  this.parseDataList2AnyEntityList(projectsJson, "Project");

        // LISTA DE MODELOS
        this.allModels           = this.createListObjDB();
    }

    // ************************************************************************************************
    // ** MÉTODOS
    // ************************************************************************************************
    generateAssociations(): void {
        // TODO: Para os test non o vexo necesario pero podería ser interesante.
    }
    /**
     * Xera un array con datos dos ficherios json convertidos en entidades dos modelos.
     * @returns CustomBaseEntity[]
     */
    createListObjDB(): CustomBaseEntity[] {
        let result  : CustomBaseEntity[] = [];

        // this.generateAssociations();

        // MODELOS SEN DEPENDENCIAS
        result.push(...this.priorities);
        result.push(...this.roles);
        result.push(...this.types);
        result.push(...this.UserContactTypes);
        result.push(...this.userSchedules);
        result.push(...this.stages);
        result.push(...this.states);

        // MODELOS CUNHA SOA DEPENDENCIA
        result.push(...this.resoruces);
        result.push(...this.userContacts);
        result.push(...this.userGroups);

        // MODELOS CON VARIAS DEPENDENCIAS
        result.push(...this.users);
        result.push(...this.comments);
        result.push(...this.assignedUsers);
        result.push(...this.assignedResources);
        result.push(...this.assignedStages);
        result.push(...this.repositories);
        result.push(...this.performances);
        result.push(...this.requirements);
        result.push(...this.stateHistory);
        result.push(...this.projects);

        return result;
    }

    /**
     * Xera un array de obxectos da clase co nome indicado nos parámetros a partir dos datos da lista de
     * obxectos literais pasada.
     *
     * @param dataList array de obxectos literais
     * @param className Nome da clase que se vai a crear
     * @returns AnyEntity[]
     */
    parseDataList2AnyEntityList(dataList: any[], className: string): CustomBaseEntity[] {
        let result: CustomBaseEntity[] = [];

        dataList.forEach(item => {
            result.push(this.create(className, item));
        });

        return result;
    }
    create(className: string, args: any) {
        var obj = null;

        // TODO: refactorizar, demasiados case. Buscar xeito de construir o obxecto a partir do nome da clase
        switch(className) {
            // MODELOS SEN DEPENDENCIAS
            case "Priority":
                obj = new Priority(args);
                break;
            case "Role":
                obj = new Role(args);
                break;
            case "Type":
                obj = new Type(args);
                break;
            case "UserContactType":
                obj = new UserContactType(args);
                break;
            case "UserSchedule":
                obj = new UserSchedule(args);
                break;
            case "Stage":
                obj = new Stage(args);
                break;
            case "State":
                obj = new State(args);
                break;

            // MODELOS CUNHA SOA DEPENDENCIA
            case "Resource":
                obj = new Resource(args);
                break;
            case "UserContact":
                obj = new UserContact(args);
                break;

            case "UserGroup":
                obj = new UserGroup(args);
                break;

            // MODELOS CON VARIAS DEPENDENCIAS
            case "User":
                obj = new User(args);
                break;
            case "CommentApp":
                obj = new CommentApp(args);
                break;
            case "AssignedUser":
                obj = new AssignedUser(args);
                break;
            case "AssignedResource":
                obj = new AssignedResource(args);
                break;
            case "AssignedStage":
                obj = new AssignedStage(args);
                break;
            case "RepositoryApp":
                obj = new RepositoryApp(args);
                break;
            case "PerformanceApp":
                obj = new PerformanceApp(args);
                break;
            case "Requirement":
                obj = new Requirement(args);
                break;
            case "StateHistory":
                obj = new StateHistory(args);
                break;
            case "Project":
                obj = new Project(args);
                break;
        }


        return obj;
    }
}
