// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { ResourceController } from '../controllers/resource.controller';

// ##################################################################################################
// ## CLASE ResourceRoutes
// ##################################################################################################
export class ResourceRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private resourceController : ResourceController = new ResourceController();
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
    this.router.post('', this.resourceController.create);
    this.router.post('/Multiple', this.resourceController.createList);

    // GET
    this.router.get('', this.resourceController.getAll);
    this.router.get('/:id', this.resourceController.get);

    // PUT
    this.router.put('/:id', this.resourceController.update);

    // PATCH
    this.router.patch('/:id', this.resourceController.modify);

    // DELETE
    this.router.delete('/:id', this.resourceController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
