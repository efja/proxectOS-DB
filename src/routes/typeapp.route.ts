// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { TypeAppController } from '../controllers/typeapp.controller';

// ##################################################################################################
// ## CLASE TypeAppRoutes
// ##################################################################################################
export class TypeAppRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private typeController : TypeAppController = new TypeAppController();
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
    this.router.post('', this.typeController.create);
    this.router.post('/Multiple', this.typeController.createList);

    // GET
    this.router.get('', this.typeController.getAll);
    this.router.get('/:id', this.typeController.get);

    // PUT
    this.router.put('/:id', this.typeController.update);

    // PATCH
    this.router.patch('/:id', this.typeController.modify);

    // DELETE
    this.router.delete('/:id', this.typeController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
