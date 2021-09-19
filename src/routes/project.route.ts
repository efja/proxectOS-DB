// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import express, { Router, IRouter } from 'express';
import { ProjectController } from '../controllers/project.controller';

// ####################################################################################################
// ## CLASE ProjectRoutes
// ####################################################################################################
export class ProjectRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private projectController = new ProjectController();
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
    // GET
    this.router.get('', this.projectController.getAllProjects);
    this.router.get('/:id', this.projectController.getProject);

    // POST
    this.router.post(
      '',
      this.projectController.newProject,
      this.projectController.newProject
    );

    // PATCH
    this.router.patch('/:id', this.projectController.updateProject);

    // PUT
    this.router.put('/:id', this.projectController.updateProject);

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
