// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import express, { Router, IRouter } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ProjectService } from '../services/project.service';

// ####################################################################################################
// ## CLASE ProjectRoutes
// ####################################################################################################
export class ProjectRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private projectController :ProjectController = new ProjectController();
  private router = Router();

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    this.routes();
  }

  // ************************************************************************************************
  // ** RUTAS
  // ************************************************************************************************
  private routes = () => {
    // POST
    this.router.post('', this.projectController.newProject);
    this.router.post('/Multiple', this.projectController.newProjectList);

    // GET
    this.router.get('', this.projectController.getAllProjects);
    this.router.get('/:id', this.projectController.getProject);

    // PUT
    this.router.put('/:id', this.projectController.updateProject);

    // PATCH
    this.router.patch('/:id', this.projectController.modifyProject);

    // DELETE
    this.router.delete('/:id', this.projectController.deleteProject);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
