/* eslint-disable @typescript-eslint/no-explicit-any */
// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import HttpStatus from 'http-status-codes';
import { Operation } from 'fast-json-patch';
import { req, res, next } from 'express';

import { ResponseData } from '../interfaces/response-data.interface';
import { APIFilter } from '../helpers/uri-filter.helper';

// ##################################################################################################
// ## CLASE BaseController
// ##################################################################################################
export abstract class BaseController<T> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected TRANSLATION_NAME_MODEL  : string;
  protected minimumAttributes       : string[] = [];
  protected serviceName             : any;
  protected service                 : any;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor(
    protected entity,
    serviceName
  ) {
    this.serviceName = serviceName;

    this.service = new serviceName();
  }

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
      let response;

      if (Object.keys(req.body).length > 0) {
        const obj: T = req.body;

        if (this.hasMinimumAttributes(obj)) {
          response = await this.service.create(obj);
        }
      }

      const responseData : ResponseData = this.processResponse(req, response, 'CREATE');

      res.status(responseData.code).json(responseData);
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
      let response;

      if (Object.keys(req.body).length > 0) {
        const objs: T[] = req.body;

        let continueProcess: boolean = true;

        for (let i = 0; i < objs.length; i++) {
          let item = objs[i];

          if (this.hasMinimumAttributes(item)) {
            // Crease un proxecto novo para asegurar que vai a ser do tipo correcto
            objs[i] = this.getNewEntity(item);
          } else {
            continueProcess = false;
            break;
          }
        }

        if (continueProcess && objs && objs.length > 0) {
          response = await this.service.createList(objs);
        }
      }

      const responseData : ResponseData = this.processResponse(req, response, 'CREATE_LIST');

      res.status(responseData.code).json(responseData);
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
      const {
        orderBy,
        limit,
        offset,
        ...query
      } = req.query

      const queryParams = new APIFilter(query);

      let response = await this.service.getAll(queryParams.getQueryObj(), orderBy, limit, offset);

      const responseData : ResponseData = this.processResponse(req, response, 'GET_LIST');

      res.status(responseData.code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

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
      const { id } = req.params;
      const queryParams = new APIFilter(req.query);

      let response = await this.service.get(id, queryParams.getQueryObj());

      const responseData : ResponseData = this.processResponse(req, response, 'GET');

      res.status(responseData.code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

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
      const { id } = req.params;

      let response;

      if (Object.keys(req.body).length !== 0) {
        const obj: T = this.getNewEntity(req.body);

        response = await this.service.update(id, obj);
      }

      const responseData : ResponseData = this.processResponse(req, response, 'UPDATE');

      res.status(responseData.code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

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
      const { id } = req.params;
      const tempPatch: Operation[] = req.body;
      let objPatch: Operation[] = [];

      let response;

      if (tempPatch.length > 0) {
        // Quitanse as modficacións de ids.
        objPatch = tempPatch.filter(op => !op.path.includes("id"));
      }

      if (objPatch.length > 0) {
        response = await this.service.modify(id, objPatch);
      }

      const responseData : ResponseData = this.processResponse(req, response, 'UPDATE');

      res.status(responseData.code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

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
      const { id } = req.params;

      let response = await this.service.delete(id);

      const responseData : ResponseData = this.processResponse(req, response, 'DELETE');

      res.status(responseData.code).json(responseData);
    } catch (error) {
      next(error);
    }
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
  /**
   * Procesa a resposta HTTP da conexión coa BD.
   *
   * @param req request do método HTTP
   * @param response resposta do método HTTP
   * @param method metótodo para o cal procesar a resposta
   * @returns ResponseData
   */
  protected processResponse(req, response: ResponseData, method: string): ResponseData {
    method = method.toUpperCase();

    let isPlural = method.includes('LIST');
    let isError  = false;
    let plural = (isPlural)
      ? '_PLURAL'
      : '';
    let id = (response && response.data && response.data.id)
      ? response.data.id
      : undefined;

    if (
      !response ||
      (
        response.code != HttpStatus.OK &&
        response.code != HttpStatus.CREATED
      )
    ) {
      isError = true;
    }

    let code = (response && response.code)
      ? response.code
      : HttpStatus.CONFLICT;
    let data = (response)
      ? response.data
      : undefined;
    let message = (!isError && response)
      ? response.message
      : undefined;
    let error = (isError && response)
      ? response.error
      : `ERROR.${method}`;

    if (message) {
      message = req.t(message, { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME${plural}`), id: id });
    }

    if (error) {
      error = req.t(error, { entity: req.t(`${this.TRANSLATION_NAME_MODEL}.NAME${plural}`), id: id });
    }

    const responseData: ResponseData = {
      code,
      data    : (!isError)
        ? (data)
        : undefined,
      message : (!isError)
        ? message
        : undefined,
      error   : (isError)
        ? error
        : undefined,
    };

    if (isPlural) {
      responseData.total = (response)
        ? response.total
        : 0;
      responseData.from = (response)
        ? response.from
        : 0;
      responseData.limit = (response)
        ? response.limit
        : 0;
    }

    return responseData;
  }

  /**
   * Comproba se o AssignedResource pasado ten os atributos mínimos que o modelo necesita.
   *
   * @param item AssignedResource que se vai a avaliar
   * @returns Boolean
   *
   * @link https://stackoverflow.com/a/59484923 - Probas pero sen usar.
   * @link https://stackoverflow.com/a/45604667 - Probas pero sen usar.
   * @link https://stackoverflow.com/a/59292958 - Probas pero sen usar.
   */
  protected hasMinimumAttributes(item: T): Boolean {
    let result = true;

    if (!item) {
      result = false;
    } else {
      for (let prop of this.minimumAttributes) {
        if (item[prop] == undefined) {
          result = false;
          break;
        }
      }
    }

    return result;
  }

  /**
   * Crea unha nova instancia da clase xenérica.
   *
   * @param obj novo obxecto da clase xenérica
   * @returns Unha instancia concreta de T
   *
   * @link https://stackoverflow.com/a/26696476
   * @link https://newbedev.com/create-a-new-object-from-type-parameter-in-generic-class
   */
  getNewEntity(params?) : T {
      return new this.entity(params);
  }
}
