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

// ##################################################################################################
// ## CLASE BaseService
// ##################################################################################################
export abstract class BaseService<T> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected db          : DBConnection;
  protected respository : any;
  protected entityName  : any;
  protected includes    : string[] = [];

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
  public async create(obj: T): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (obj["id"] != null) {
        temp = await this.respository.findOne(obj["id"]);
      }

      if (temp == null) {
        temp = new this.entityName();

        if (obj["id"]){
          obj["_id"] = new ObjectId(obj["id"]);
        }

        temp.assign(obj, { em: this.db.orm.em });

        await this.respository.persist(temp).flush();

        result = temp;
      }
    } catch (error) {
      result = null;
    }
    return result;
  }

  public async createList(obj: T[]): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

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
      }

      if (temp == null || temp.length == 0) {
        await this.respository.persistAndFlush(obj);
        result = obj;
      }
    } catch (error) {
      result = null;
    }

    return result;
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
  ): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      result = await this.respository.find(filters, orderBy, limit, offset);

      if (result.length == 0) {
        result = HttpStatus.NOT_FOUND;
      }

    } catch (error) {
      result = null;
    }

    return result;
  }

  public async get(id: string, filters?: any): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      result = await this.respository.findOne({ id, ...filters });
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (UPDATE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- PUT
  // ------------------------------------------------------------------------------------------------
  public async update(id: string, obj: T): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

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
            // Gárdanse os cambios na entidade
            temp.assign(updateData, { em: this.db.orm.em }, [this.entityName.name]);

            // Actualizase a informanción na BD
            this.db.orm.em.nativeUpdate(this.entityName, {id}, temp);
            await this.respository.flush(temp);

            result = temp;
          }
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- PATCH
  // ------------------------------------------------------------------------------------------------
  public async modify(id: string, objPatch: Operation[]): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

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
            result = HttpStatus.CONFLICT;
          }
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- DELETE
  // ------------------------------------------------------------------------------------------------
  public async delete(id: string): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

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

          result = temp;
        } catch (error) {
          result = HttpStatus.CONFLICT;
        }
      }
    } catch (error) {
      result = null;
    }

    return result;
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
  findOne(id) {
    return this.respository.findOne(id, this.includes);
  }

  findOneFilters(id, filters) {
    return this.respository.findOne({ id, ...filters });
  }
}
