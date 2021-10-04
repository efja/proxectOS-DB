/* eslint-disable @typescript-eslint/no-explicit-any */
// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { ProjectService } from '../services/project.service';

import { req, res, next } from 'express';
import { ResponseData } from '../interfaces/response-data.interface';

// ####################################################################################################
// ## CLASE ProjectController
// ####################################################################################################
export class ProjectController {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  public ProjectService = new ProjectService();

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() { }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CONSULTA)
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
      const data = [];

      let responseData : ResponseData = {
        code    : HttpStatus.OK,
        data    : data,
        total   : data.length,
        from    : 0,
        limit   : 0,
        message : req.t('PROJECT.SERVICE.SUCCESS.GET_ALL'),
      };

      res.status(HttpStatus.OK).json(responseData);
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
      const data = {};

      let responseData : ResponseData = {
        code    : HttpStatus.OK,
        data    : data,
        message : req.t('PROJECT.SERVICE.SUCCESS.GET_SINGLE')
      };

      res.status(HttpStatus.OK).json(responseData);
    } catch (error) {
      next(error);
    }
  };

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
      const data = {};

      let responseData : ResponseData = {
        code    : HttpStatus.CREATED,
        data    : data,
        message : req.t('PROJECT.SERVICE.SUCCESS.CREATE')
      };

      res.status(HttpStatus.OK).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (ACTUALIZACIÓN)
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
      const data = {};

      let responseData : ResponseData = {
        code    : HttpStatus.ACCEPTED,
        data    : data,
        message : req.t('PROJECT.SERVICE.SUCCESS.UPDATE')
      };

      res.status(HttpStatus.OK).json(responseData);
    } catch (error) {
      next(error);
    }
  };

  // ************************************************************************************************
  // ** MÉTODOS CRUD (BORRADO)
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
      const data = {};

      let responseData : ResponseData = {
        code    : HttpStatus.OK,
        data    : data,
        message : req.t('PROJECT.SERVICE.SUCCESS.DELETE')
      };

      res.status(HttpStatus.OK).json(responseData);
    } catch (error) {
      next(error);
    }
  };
}
