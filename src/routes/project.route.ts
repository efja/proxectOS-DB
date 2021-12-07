// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';
import { ProjectController } from '../controllers/project.controller';

// ##################################################################################################
// ## CLASE ProjectRoutes
// ##################################################################################################
export class ProjectRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private projectController : ProjectController = new ProjectController();
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
    this.router.post('', this.projectController.create);
    this.router.post('/Multiple', this.projectController.createList);

    // GET
    this.router.get('', this.projectController.getAll);
    this.router.get('/:id', this.projectController.get);

    // PUT
    this.router.put('/:id', this.projectController.update);

    // PATCH
    this.router.patch('/:id', this.projectController.modify);

    // DELETE
    this.router.delete('/:id', this.projectController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
