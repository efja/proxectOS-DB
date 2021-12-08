// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import HttpStatus from 'http-status-codes';
import { Operation } from 'fast-json-patch';
import * as jsonpatch from 'fast-json-patch';

import { ObjectId } from '@mikro-orm/mongodb';
import { QueryOrder } from '@mikro-orm/core';

import { DBConnection } from '../config/config-db';
import { getEntityForUpdate } from '../helpers/entity-construct.helper';
import { ResponseData, ResultQuery } from '../interfaces/response-data.interface';

// ##################################################################################################
// ## CLASE BaseService
// ##################################################################################################
export abstract class BaseService<T> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected db: DBConnection;
  protected respository: any;
  protected entityName: any;
  protected includes: string[] = [];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor(entityName) {
    this.entityName = entityName;

    this.createDbConnection();
  }

  // ************************************************************************************************
  // ** MÉTODOS CONEXIÓN BD
  // ************************************************************************************************
  private async createDbConnection() {
    this.db = new DBConnection();

    await this.db.init();
    this.respository = this.db.getRepository(this.entityName);
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- POST
  // ------------------------------------------------------------------------------------------------
  public async create(obj: T): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.CONFLICT,
      data: null,
    };

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (obj["id"] != null) {
        temp = await this.respository.findOne(obj["id"]);
      }

      if (temp == null) {
        temp = new this.entityName();

        if (obj["id"]) {
          obj["_id"] = new ObjectId(obj["id"]);
        }

        temp.assign(obj, { em: this.db.orm.em });

        await this.respository.persist(temp).flush();

        result.code = HttpStatus.CREATED;
      }

      result.data = temp;
    } catch (error) {
      result = null;
    }

    return this.processResponse(result, 'CREATE');
  }

  public async createList(obj: T[]): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.CONFLICT,
      data: null,
      from: 0,
      limit: 0,
    };

    try {
      let temp = null;
      let itemIds = null;

      // Búscase se os obxectos pasados teñen definido o ID
      for (let item of obj) {
        if (item["id"] != null) {
          if (itemIds == null) {
            itemIds = [];
          }

          item["_id"] = new ObjectId(item["id"]);
          itemIds.push(item["id"]);
        }
      }

      // Comprobase que non existan as entidades na BD
      if (itemIds != null) {
        temp = await this.respository.find(itemIds);
        result.data = temp;
      }

      if (temp == null || temp.length == 0) {
        await this.respository.persistAndFlush(obj);

        result.code = HttpStatus.CREATED;
        result.data = obj;
      }
    } catch (error) {
      result = null;
    }

    return this.processResponse(result, 'CREATE_LIST');
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (READ)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- GET
  // ------------------------------------------------------------------------------------------------
  public async getAll(
    filters?: any,
    orderBy = { name: QueryOrder.ASC },
    limit: number = 0,
    offset: number = 0
  ): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.NOT_FOUND,
      data: null,
      from: offset,
      limit: limit,
    };

    try {
      result.data = await this.respository.find(filters, orderBy, limit, offset);

      if (result.data && result.data.length > 0) {
        result.code = HttpStatus.OK;
      }
    } catch (error) {
      result.code = HttpStatus.NOT_FOUND;
    }

    return this.processResponse(result, 'GET_LIST');
  }

  public async get(id: string, filters?: any): Promise<any> {
    let result =
    {
      code: HttpStatus.NOT_FOUND,
      data: null,
    };

    try {
      result.data = await this.respository.findOne({ id, ...filters });

      if (result.data) {
        result.code = HttpStatus.OK;
      } else {
        result.data = { id };
      }
    } catch (error) {
      result.code = HttpStatus.NOT_FOUND;
      result.data = { id };
    }

    return this.processResponse(result, 'GET');
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (UPDATE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- PUT
  // ------------------------------------------------------------------------------------------------
  public async update(id: string, obj: T): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.NOT_FOUND,
      data: null,
    };

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.findOne(id);
      }

      if (temp != null) {
        try {
          obj["_id"] = new ObjectId(obj["_id"]);

          let updateData = await getEntityForUpdate(obj, this.entityName.name);

          if (updateData != null) {
            delete updateData["_id"]; // Eliminase para evitar conflictos

            // Gárdanse os cambios na entidade
            temp.assign(updateData, { em: this.db.orm.em }, [this.entityName.name]);

            // Actualizase a informanción na BD
            this.db.orm.em.nativeUpdate(this.entityName, { id }, temp);
            await this.respository.flush(temp);

            result.code = HttpStatus.CREATED;
            result.data = temp;
          }
        } catch (error) {
          result.code = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    if (result && !result.data) {
      result.data = { id };
    }

    return this.processResponse(result, 'UPDATE');
  }

  // ------------------------------------------------------------------------------------------------
  // -- PATCH
  // ------------------------------------------------------------------------------------------------
  public async modify(id: string, objPatch: Operation[]): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.NOT_FOUND,
      data: null,
    };

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          // Comprobase que o JSONPatch sexa correcto
          let testPatch = jsonpatch.validate(objPatch, temp);

          // Se o validador non produce resultados daquela o JSONPatch é correcto
          if (testPatch == undefined) {
            // Aplicase o JSONPatch
            jsonpatch.applyPatch(temp, objPatch);

            // Persístese a información na base de datos
            result = await this.update(id, temp);
          } else {
            result.code = HttpStatus.CONFLICT;
          }
        } catch (error) {
          result.code = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    if (result && !result.data) {
      result.data = { id };
    }

    return this.processResponse(result, 'UPDATE');
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- DELETE
  // ------------------------------------------------------------------------------------------------
  public async delete(id: string): Promise<ResponseData> {
    let result: ResultQuery = {
      code: HttpStatus.NOT_FOUND,
      data: null,
    };

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          // Borrase a informanción na BD
          await this.respository.remove(temp).flush();;

          result.code = HttpStatus.OK;
          result.data = temp;
        } catch (error) {
          result.code = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    if (result && !result.data) {
      result.data = { id };
    }

    return this.processResponse(result, 'DELETE');
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
  /**
   * Procesa a resposta HTTP da conexión coa BD.
   *
   * @param response resposta do método HTTP
   * @param method metótodo para o cal procesar a resposta
   * @returns ResponseData
   */
  protected processResponse(response: ResultQuery, method: string): ResponseData {
    method = method.toUpperCase();

    let code = response.code;
    let data = response.data;
    let message;
    let error = `ERROR.${method}`;
    let isPlural = method.includes('LIST');

    if (response) {
      switch (code) {
        case HttpStatus.CREATED:
        case HttpStatus.OK:
          error = undefined;
          message = `SUCCESS.${method}`;
          break;
        case HttpStatus.BAD_REQUEST:
          error = 'ERROR.BAD_REQUEST';
          break;
        case HttpStatus.CONFLICT:
          error = 'ERROR.CONFLICT';

          if (method.includes('CREATE')) {
            error = (isPlural)
              ? 'ERROR.ALREADY_EXIST_LIST'
              : 'ERROR.ALREADY_EXIST';
          }
          break;
        case HttpStatus.NOT_FOUND:
          error = (isPlural)
            ? 'ERROR.NOT_FOUND_LIST'
            : 'ERROR.NOT_FOUND';
          break;
      }
    }

    const responseData: ResponseData = {
      code,
      data,
      message,
      error,
    };

    if (isPlural) {
      responseData.total = (data && data.length)
        ? data.length
        : 0;
      responseData.from = response.from;
      responseData.limit = response.limit;
    }

    return responseData;
  }

  findOne(id) {
    return this.respository.findOne(id, this.includes);
  }

  findOneFilters(id, filters) {
    return this.respository.findOne({ id, ...filters });
  }
}
