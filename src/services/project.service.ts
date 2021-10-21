// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { QueryOrder } from '@mikro-orm/core';

import { App } from './api.service';
import { DBConnection } from '../config/config-db';
import { Project } from '../models/project.model';

const {
  DBMS,
  DB_HOST,
  DB_PORT,
  DB_NAME,

  DB_LOGIN,
  DB_PASS,
} = process.env;

// ####################################################################################################
// ## CLASE ProjectService
// ####################################################################################################
export class ProjectService {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private app         : App;
  private db          : DBConnection;
  private respository : any;

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.createDbConnection();
  }

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  private async createDbConnection() {
    this.db = new DBConnection();

    await this.db.init();
    this.respository = this.db.getRepository(Project);

  }
  public async getAllProjects(): Promise<any[]> {
    let result : any[] = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }
}
