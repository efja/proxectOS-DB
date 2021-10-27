// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { RepositoryAppController } from '../controllers/repositoryapp.controller';

// ####################################################################################################
// ## CLASE RepositoryAppRoutes
// ####################################################################################################
export class RepositoryAppRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private priorityController : RepositoryAppController = new RepositoryAppController();
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
    this.router.post('', this.priorityController.create);
    this.router.post('/Multiple', this.priorityController.createList);

    // GET
    this.router.get('', this.priorityController.getAll);
    this.router.get('/:id', this.priorityController.get);

    // PUT
    this.router.put('/:id', this.priorityController.update);

    // PATCH
    this.router.patch('/:id', this.priorityController.modify);

    // DELETE
    this.router.delete('/:id', this.priorityController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
