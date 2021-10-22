/* eslint-disable @typescript-eslint/no-explicit-any */
// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { ProjectService } from '../services/project.service';

import { req, res, next } from 'express';
import { ResponseData } from '../interfaces/response-data.interface';
import { Project } from '../models/project.model';

// ####################################################################################################
// ## CLASE ProjectController
// ####################################################################################################
export class ProjectController {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  public projectService : ProjectService = new ProjectService();

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() { }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  /**
   * Crea un novo proxecto
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public newProject = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      let project: Project = new Project(req.body);

      let data;

      if (project && project.name && project.description) {
        data = await this.projectService.createProject(project);
      }

      if (data != undefined && data != null && data != HttpStatus.CONFLICT) {
        code = HttpStatus.CREATED;
        message = req.t('PROJECT.SERVICE.SUCCESS.CREATE');
      } else if (data == HttpStatus.CONFLICT) {
        data = undefined;
        error = req.t('ERROR.ALREADY_EXIST_MALE', { entity: req.t('PROJECT.NAME'), id: project.id });
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.CREATE');
      }

      let responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Crea os proxectos dunha dunha lista pasada.
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public newProjectList = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      let projects: Project[] = req.body;

      let data;
      let continueProcess: boolean = true;

      for (let i = 0; i < projects.length; i++) {
        let item = projects[i];

        if (item && item.name && item.description) {
          // Crease un proxecto novo para asegurar que vai a ser do tipo correcto
          projects[i] = new Project(item);
        } else {
          continueProcess = false;
          break;
        }
      }

      if (continueProcess && projects && projects.length > 0) {
        console.log("----------------------------------------------");
        data = await this.projectService.createProjectList(projects);
      }

      if (data != undefined && data != null) {
        code = HttpStatus.CREATED;
        message = req.t('PROJECT.SERVICE.SUCCESS.CREATE_LIST');
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.CREATE_LIST');
      }

      let responseData : ResponseData = {
        code    : code,
        data    : data,
        total   : (data && data.length) ? data.length : 0,
        from    : 0,
        limit   : 0,
        message : message,
        error   : error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (READ)
  // ************************************************************************************************
  /**
   * Recupera tódolos proxectos
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public getAllProjects = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const data = await this.projectService.getAllProjects();

      if (data != undefined && data != null) {
        code = HttpStatus.OK;
        message = req.t('PROJECT.SERVICE.SUCCESS.GET_ALL');
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.GET_ALL');
      }

      let responseData : ResponseData = {
        code    : code,
        data    : data,
        total   : data.length,
        from    : 0,
        limit   : 0,
        message : message,
        error   : error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Recupera un proxecto en concreto
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public getProject = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let code = HttpStatus.NOT_FOUND;
      let message;
      let error;

      const { id } = req.params;
      const data = await this.projectService.getProject(id);

      if (data != undefined && data != null) {
        code = HttpStatus.OK;
        message = req.t('PROJECT.SERVICE.SUCCESS.GET_SINGLE');
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.GET_SINGLE');
      }

      let responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (UPDATE)
  // ************************************************************************************************
  /**
   * Actualiza un proxecto
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public updateProject = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const data = {};

      if (data != undefined && data != null) {
        code = HttpStatus.ACCEPTED;
        message = req.t('PROJECT.SERVICE.SUCCESS.UPDATE');
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.UPDATE');
      }

      let responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  /**
   * Elimina un proxecto concreto
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public deleteProject = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const data = {};

      if (data != undefined && data != null) {
        code = HttpStatus.OK;
        message = req.t('PROJECT.SERVICE.SUCCESS.DELETE');
      } else {
        error = req.t('PROJECT.SERVICE.ERROR.DELETE');
      }

      let responseData : ResponseData = {
        code,
        data,
        message,
        error,
      };

      res.status(code).json(responseData);
    } catch (error) {
      next(error);
    }
  };
}
