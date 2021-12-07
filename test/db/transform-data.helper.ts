// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { DBTestConnection } from './config-db';

// MODELOS
import { CustomBaseEntity } from '../../src/models/custom-base-entity.model';

import { AssignedResource } from '../../src/models/assigned-resource.model';
import { AssignedStage } from '../../src/models/assigned-stage.model';
import { AssignedUser } from '../../src/models/assigned-user.model';
import { CommentApp } from '../../src/models/commentapp.model';
import { Priority } from '../../src/models/priority.model';
import { Project } from '../../src/models/project.model';
import { RepositoryApp } from '../../src/models/repositoryapp.model';
import { Requirement } from '../../src/models/requirement.model';
import { Resource } from '../../src/models/resource.model';
import { Role } from '../../src/models/role.model';
import { Stage } from '../../src/models/stage.model';
import { State } from '../../src/models/state.model';
import { StateHistory } from '../../src/models/state-history.model';
import { TypeApp } from '../../src/models/typeapp.model';
import { User } from '../../src/models/user.model';
import { UserContact } from '../../src/models/user-contact.model';
import { UserContactType } from '../../src/models/user-contact-type.model';
import { UserGroup } from '../../src/models/user-group.model';
import { UserSchedule } from '../../src/models/user-schedule.model';
import { Collection } from '@mikro-orm/core';
// ##################################################################################################
// ## HELPERS
// ##################################################################################################
export function createUser(data: any, db: DBTestConnection): User {
    const repoUserSchedule = db.orm.em.getRepository(UserSchedule);
    const repoUserContact = db.orm.em.getRepository(UserContact);
    const repoUserGroup = db.orm.em.getRepository(UserGroup);

    let result: User = new User(data);

    if (data.userSchedule) {
        result.userSchedule = repoUserSchedule.getReference(data.userSchedule, true);
    }

    if (data.contacts) {
        result.contacts = new Collection<UserContact>(result);

        for (let item of data.contacts) {
            result.contacts.add(repoUserContact.getReference(item, true));
        }
    }

    if (data.defaultUserGroups) {
        result.defaultUserGroups = new Collection<UserGroup>(result);

        for (let item of data.defaultUserGroups) {
            result.defaultUserGroups.add(repoUserGroup.getReference(item, true));
        }
    }

    return result;
}

export function createAssignedUser(data: any, db: DBTestConnection): AssignedUser {
    const repoUser = db.orm.em.getRepository(User);
    const repoRole = db.orm.em.getRepository(Role);
    const repoUserGroup = db.orm.em.getRepository(UserGroup);

    let result: AssignedUser = new AssignedUser(data);

    if (data.createdBy) {
        result.createdBy = repoUser.getReference(data.createdBy, true);
    }

    if (data.assignedUser) {
        result.assignedUser = repoUser.getReference(data.assignedUser, true);
    }

    if (data.assignedRoles) {
        result.assignedRoles = new Collection<Role>(result);

        for (let item of data.assignedRoles) {
            result.assignedRoles.add(repoRole.getReference(item, true));
        }
    }

    if (data.assignedUserGroups) {
        result.assignedUserGroups = new Collection<UserGroup>(result);

        for (let item of data.assignedUserGroups) {
            result.assignedUserGroups.add(repoUserGroup.getReference(item, true));
        }
    }

    return result;
}

