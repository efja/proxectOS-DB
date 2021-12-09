// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { StateController } from '../../controllers/models/state.controller';

// ##################################################################################################
// ## CLASE StateRoutes
// ##################################################################################################
export class StateRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private stateController : StateController = new StateController();
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
    this.router.post('', this.stateController.create);
    this.router.post('/Multiple', this.stateController.createList);

    // GET
    this.router.get('', this.stateController.getAll);
    this.router.get('/:id', this.stateController.get);

    // PUT
    this.router.put('/:id', this.stateController.update);

    // PATCH
    this.router.patch('/:id', this.stateController.modify);

    // DELETE
    this.router.delete('/:id', this.stateController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
