// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { QueryOrder } from '@mikro-orm/core';

import { DBConnection } from '../config/config-db';
import { Project } from '../models/project.model';

// ####################################################################################################
// ## CLASE ProjectService
// ####################################################################################################
export class ProjectService {
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
    this.respository = this.db.getRepository(Project);

  }

  // ************************************************************************************************
  // ** CRUD
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- CREATE
  // ------------------------------------------------------------------------------------------------
  public async createProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- READ
  // ------------------------------------------------------------------------------------------------
  // GET
  public async getAllProjects(): Promise<Project[]> {
    let result : Project[] = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // GET
  public async getProject(id: string): Promise<Project> {
    let result : Project = await this.respository.findOne(id);

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- UPDATE
  // ------------------------------------------------------------------------------------------------
  // PUT
  public async updateProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // PATCH
  public async modifyProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- DELETE
  // ------------------------------------------------------------------------------------------------
  // DELETE
  public async deleteProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }
}
