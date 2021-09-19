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

  // Proxectos
  router.use('/projects', new ProjectRoutes().getRoutes());

  return router;
};
