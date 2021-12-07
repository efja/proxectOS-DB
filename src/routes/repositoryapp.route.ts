// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { RepositoryAppController } from '../controllers/repositoryapp.controller';

// ##################################################################################################
// ## CLASE RepositoryAppRoutes
// ##################################################################################################
export class RepositoryAppRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private repositoryAppController : RepositoryAppController = new RepositoryAppController();
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
    this.router.post('', this.repositoryAppController.create);
    this.router.post('/Multiple', this.repositoryAppController.createList);

    // GET
    this.router.get('', this.repositoryAppController.getAll);
    this.router.get('/:id', this.repositoryAppController.get);

    // PUT
    this.router.put('/:id', this.repositoryAppController.update);

    // PATCH
    this.router.patch('/:id', this.repositoryAppController.modify);

    // DELETE
    this.router.delete('/:id', this.repositoryAppController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
