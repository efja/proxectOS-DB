// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { Operation } from 'fast-json-patch';
import * as jsonpatch from 'fast-json-patch';

import { getEntityForUpdate } from '../helpers/entity-construct.helper';

import { DBConnection } from '../config/config-db';
import { UserContact } from '../models/user-contact.model';

// ####################################################################################################
// ## CLASE UserContactService
// ####################################################################################################
export class UserContactService {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private db          : DBConnection;
  private respository : any;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.createDbConnection();
  }

  // ************************************************************************************************
  // ** MÉTODOS CONEXIÓN BD
  // ************************************************************************************************
  private async createDbConnection() {
    this.db = new DBConnection();

    await this.db.init();
    this.respository = this.db.getRepository(UserContact);
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- POST
  // ------------------------------------------------------------------------------------------------
  public async create(userContact: UserContact): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (userContact.id != null) {
        temp = await this.respository.findOne(userContact.id);
      }

      if (temp == null) {
        temp = new UserContact();
        temp.assign(userContact, { em: this.db.orm.em });

        await this.respository.persist(temp).flush();

        result = temp;
      }
    } catch (error) {
      result = null;
    }
    return result;
  }

  public async createList(userContacts: UserContact[]): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;
      let userContactIds = null;

      // Búscase se os obxectos pasados teñen definido o ID
      for (let userContact of userContacts) {
        if (userContact.id != null) {
          if (userContactIds == null) {
            userContactIds = [];
          }

          userContactIds.push(userContact.id);
        }
      }

      // Comprobase que non existan as entidades na BD
      if (userContactIds != null) {
        temp = await this.respository.find(userContactIds);
      }

      if (temp == null || temp.length == 0) {
        await this.respository.persistAndFlush(userContacts);
        result = userContacts;
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
  public async update(id: string, userContact: UserContact): Promise<any> {
    let result : any = HttpStatus.NOT_FOUND;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (id != null) {
        temp = await this.respository.findOne(id);
      }

      if (temp != null) {
        try {
          let updateData = await getEntityForUpdate(userContact, 'UserContact');

          if (updateData != null) {
            // Gárdanse os cambios na entidade
            temp.assign(updateData, { em: this.db.orm.em });

            // Actualizase a informanción na BD
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
}
