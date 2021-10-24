// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { IRouter, Router } from 'express';
import { ProjectRoutes } from './project.route';

// ####################################################################################################
// ## CONSTANTES
// ####################################################################################################
const api_name = process.env.APP_NAME;
const api_version = process.env.npm_package_version;
const router = Router();

// ####################################################################################################
// ## RUTAS
// ####################################################################################################
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
  router.use('/assignedResources', new ProjectRoutes().getRoutes());

  // AssignedStage
  router.use('/assignedStages', new ProjectRoutes().getRoutes());

  // AssignedUser
  router.use('/assignedUsers', new ProjectRoutes().getRoutes());

  // CommentApp
  router.use('/comments', new ProjectRoutes().getRoutes());

  // PerformanceApp
  router.use('/performances', new ProjectRoutes().getRoutes());

  // Priority
  router.use('/priorities', new ProjectRoutes().getRoutes());

  // Project
  router.use('/projects', new ProjectRoutes().getRoutes());

  // RepositoryApp
  router.use('/repositories', new ProjectRoutes().getRoutes());

  // Requirement
  router.use('/requirements', new ProjectRoutes().getRoutes());

  // Resource
  router.use('/resources', new ProjectRoutes().getRoutes());

  // Role
  router.use('/roles', new ProjectRoutes().getRoutes());

  // Stage
  router.use('/stages', new ProjectRoutes().getRoutes());

  // State
  router.use('/states', new ProjectRoutes().getRoutes());

  // StateHistory
  router.use('/statesHistory', new ProjectRoutes().getRoutes());

  // Type
  router.use('/types', new ProjectRoutes().getRoutes());

  // User
  router.use('/users', new ProjectRoutes().getRoutes());

  // UserContact
  router.use('/userContacts', new ProjectRoutes().getRoutes());

  // UserGroup
  router.use('/userGroups', new ProjectRoutes().getRoutes());

  // UserSchedule
  router.use('/userSchedules', new ProjectRoutes().getRoutes());

  return router;
};
