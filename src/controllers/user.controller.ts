/* eslint-disable @userscript-eslint/no-explicit-any */
// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { Operation } from 'fast-json-patch';
import { req, res, next } from 'express';
import qs from 'qs';

import { ResponseData } from '../interfaces/response-data.interface';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

// ####################################################################################################
// ## CLASE UserController
// ####################################################################################################
export class UserController {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private TRANSLATION_NAME_MODEL : string = 'USER';
  public userService : UserService = new UserService();

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() { }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  /**
   * Crea un novo proxecto. (POST)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public create = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      const user: User = new User(req.body);

      let data;

      if (this.hasMinimumAttributes(user)) {
        data = await this.userService.create(user);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.CREATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      } else if (data == HttpStatus.CONFLICT) {
        data = undefined;
        error = req.t('ERROR.ALREADY_EXIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: user.id });
      } else {
        data = undefined;
        error = req.t('ERROR.CREATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      }

      const responseData : ResponseData = {
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
   * Crea os proxectos dunha dunha lista pasada. (POST)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public createList = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.CONFLICT;

      const users: User[] = req.body;

      let data;
      let continueProcess: boolean = true;

      for (let i = 0; i < users.length; i++) {
        let item = users[i];

        if (this.hasMinimumAttributes(item)) {
          // Crease un proxecto novo para asegurar que vai a ser do tipo correcto
          users[i] = new User(item);
        } else {
          continueProcess = false;
          break;
        }
      }

      if (continueProcess && users && users.length > 0) {
        data = await this.userService.createList(users);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.CREATE_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else if (data == HttpStatus.CONFLICT) {
        data = undefined;
        error = req.t('ERROR.ALREADY_EXIST_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else {
        data = undefined;
        error = req.t('ERROR.CREATE_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      }

      const responseData : ResponseData = {
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
   * Recupera tódolos proxectos. (GET)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public getAll = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const {
        orderBy,
        limit,
        offset,
        ...query
      } = req.query

      const queryParams = qs.parse(query);

      let data = await this.userService.getAll(queryParams, orderBy, limit, offset);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.GET_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND_LIST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME_PLURAL`) });
      }

      const responseData : ResponseData = {
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
  };

  /**
   * Recupera un proxecto en concreto. (GET)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public get = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let code = HttpStatus.NOT_FOUND;
      let message;
      let error;

      const { id } = req.params;
      const queryParams = qs.parse(req.query);

      let data = await this.userService.get(id, queryParams);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.GET', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
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
   * Actualiza un proxecto. (PUT)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public update = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const { id } = req.params;
      const user: User = new User(req.body);

      let data;

      if (this.hasMinimumAttributes(user)) {
        data = await this.userService.update(id, user);
      }

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.NOT_FOUND &&
        data != HttpStatus.CONFLICT
      ) {
        code = HttpStatus.CREATED;
        message = req.t('SUCCESS.UPDATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else if (data == HttpStatus.CONFLICT) {
        code = HttpStatus.CONFLICT;
        data = undefined;
        error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else {
        data = undefined;
        error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
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
   * Actualiza un proxecto. (PATCH)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
   public modify = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let message;
      let error;
      let code = HttpStatus.NOT_FOUND;

      const { id } = req.params;
      const tempPatch: Operation[] = req.body;
      let objPatch: Operation[] = [];

      let data;

      if (tempPatch.length > 0) {
        // Quitanse as modficacións de ids.
        objPatch = tempPatch.filter(op => !op.path.includes("id"));
      }

      if (objPatch.length > 0) {

        data = await this.userService.modify(id, objPatch);

        if (
          data != undefined &&
          data != null &&
          data != HttpStatus.NOT_FOUND &&
          data != HttpStatus.CONFLICT
        ) {
          code = HttpStatus.CREATED;
          message = req.t('SUCCESS.UPDATE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        } else if (data == HttpStatus.CONFLICT) {
          code = HttpStatus.CONFLICT;
          data = undefined;
          error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        } else {
          data = undefined;
          error = req.t('ERROR.NOT_FOUND', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
        }
      } else {
        code = HttpStatus.BAD_REQUEST;
        error = req.t('ERROR.BAD_REQUEST', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`) });
      }

      const responseData : ResponseData = {
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
   * Elimina un proxecto concreto. (DELETE)
   *
   * @param req - obxecto da petición
   * @param res - obxecto da resposta
   * @param next
   */
  public delete = async (
    req   : req,
    res   : res,
    next  : next
  ): Promise<any> => {
    try {
      let code = HttpStatus.NOT_FOUND;
      let message;
      let error;

      const { id } = req.params;

      let data = await this.userService.delete(id);

      if (
        data != undefined &&
        data != null &&
        data != HttpStatus.CONFLICT &&
        data != HttpStatus.NOT_FOUND
      ) {
        code = HttpStatus.OK;
        message = req.t('SUCCESS.DELETE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else if (data == HttpStatus.CONFLICT) {
        code = HttpStatus.CONFLICT;
        data = undefined;
        error = req.t('ERROR.CONFLICT', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      } else {
        data = undefined;
        error = req.t('ERROR.DELETE', { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME`), id: id });
      }

      const responseData : ResponseData = {
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
  // ** UTILIDADES
  // ************************************************************************************************
  /**
   * Comproba se o User pasado ten os atributos mínimos que o modelo necesita.
   *
   * @param item User que se vai a avaliar
   * @returns Boolean
   */
  private hasMinimumAttributes = (item: User): Boolean => {
    let result = false;

    if (
      item &&
      item.name &&
      item.login &&
      item.password &&
      item.isCustomer
    ) {
      result = true;
    }

    return result;
  }
}