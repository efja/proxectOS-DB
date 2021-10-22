// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import HttpStatus from 'http-status-codes';
import { QueryOrder, wrap } from '@mikro-orm/core';

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
  // ** MÉTODOS CRUD (CREACIÓN)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- POST
  // ------------------------------------------------------------------------------------------------
  public async createProject(project: Project): Promise<any> {
    let result : any = HttpStatus.CONFLICT;

    try {
      let temp = null;

      // Comprobase que non exista a entidade na BD
      if (project.id != null) {
        temp = await this.respository.findOne(project.id);
      }

      if (temp == null) {
        await this.respository.persistAndFlush(project);
        result = project;
      }
    } catch (error) {
      result = null;
    }
    return result;
  }

  public async createProjectList(projects: Project[]): Promise<Project[]> {
    let result : Project[] = [];

    try {
      await this.respository.persistAndFlush(projects);
      result = projects;
    } catch (error) {
      console.log('error persistAndFlush:>> ', error);
    }

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (READ)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- GET
  // ------------------------------------------------------------------------------------------------
  public async getAllProjects(): Promise<Project[]> {
    let result : Project[];

    try {
      result = await this.respository.findAll({ name: QueryOrder.DESC }, 20);
    } catch (error) {
      result = null;
    }

    return result;
  }

  public async getProject(id: string): Promise<Project> {
    let result : Project;

    try {
      result = await this.respository.findOne(id);
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
  public async updateProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // ------------------------------------------------------------------------------------------------
  // -- PATCH
  // ------------------------------------------------------------------------------------------------
  public async modifyProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }

  // ************************************************************************************************
  // ** MÉTODOS CRUD (DELETE)
  // ************************************************************************************************
  // ------------------------------------------------------------------------------------------------
  // -- DELETE
  // ------------------------------------------------------------------------------------------------
  public async deleteProject(): Promise<Project> {
    let result : Project = await this.respository.findAll({ name: QueryOrder.DESC }, 20);

    return result;
  }
}
