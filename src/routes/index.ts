// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { IRouter, Router } from 'express';

import { AssignedResourceRoutes } from './assigned-resource.route';
import { AssignedStageRoutes } from './assigned-stage.route';
import { AssignedUserRoutes } from './assigned-user.route';
import { CommentAppRoutes } from './commentapp.route';
import { PriorityRoutes } from './priority.route';
import { ProjectRoutes } from './project.route';
import { RepositoryAppRoutes } from './repositoryapp.route';
import { RequirementRoutes } from './requirement.route';
import { ResourceRoutes } from './resource.route';
import { RoleRoutes } from './role.route';
import { StageRoutes } from './stage.route';
import { StateHistoryRoutes } from './state-history.route';
import { StateRoutes } from './state.route';
import { TypeAppRoutes } from './typeapp.route';
import { UserContactRoutes } from './user-contact.route';
import { UserContactTypeRoutes } from './user-contact-type.route';
import { UserGroupRoutes } from './user-group.route';
import { UserRoutes } from './user.route';
import { UserScheduleRoutes } from './user-schedule.route';

// ##################################################################################################
// ## CONSTANTES
// ##################################################################################################
const api_name = process.env.APP_NAME;
const api_version = process.env.npm_package_version;
const router = Router();

// ##################################################################################################
// ## RUTAS
// ##################################################################################################
/**
 * Función que conten as rutas da aplicación
 *
 * @returns router
 */
 export function routes(): IRouter {
  // Benvida
  router.get('/', (req, res) => {
    res.json(req.t('WELCOME', { app: api_name, version: api_version }));
  });

  // AssignedResource
  router.use('/assignedResources', new AssignedResourceRoutes().getRoutes());

  // AssignedStage
  router.use('/assignedStages', new AssignedStageRoutes().getRoutes());

  // AssignedUser
  router.use('/assignedUsers', new AssignedUserRoutes().getRoutes());

  // CommentApp
  router.use('/comments', new CommentAppRoutes().getRoutes());

  // Priority
  router.use('/priorities', new PriorityRoutes().getRoutes());

  // Project
  router.use('/projects', new ProjectRoutes().getRoutes());

  // RepositoryApp
  router.use('/repositories', new RepositoryAppRoutes().getRoutes());

  // Requirement
  router.use('/requirements', new RequirementRoutes().getRoutes());

  // Resource
  router.use('/resources', new ResourceRoutes().getRoutes());

  // Role
  router.use('/roles', new RoleRoutes().getRoutes());

  // Stage
  router.use('/stages', new StageRoutes().getRoutes());

  // State
  router.use('/states', new StateRoutes().getRoutes());

  // StateHistory
  router.use('/statesHistory', new StateHistoryRoutes().getRoutes());

  // type
  router.use('/types', new TypeAppRoutes().getRoutes());

  // User
  router.use('/users', new UserRoutes().getRoutes());

  // UserContact
  router.use('/userContacts', new UserContactRoutes().getRoutes());

  // UserContactType
  router.use('/userContactTypes', new UserContactTypeRoutes().getRoutes());

  // UserGroup
  router.use('/userGroups', new UserGroupRoutes().getRoutes());

  // UserSchedule
  router.use('/userSchedules', new UserScheduleRoutes().getRoutes());

  return router;
};
