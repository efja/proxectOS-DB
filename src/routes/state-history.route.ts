// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { StateHistoryController } from '../controllers/state-history.controller';

// ##################################################################################################
// ## CLASE StateHistoryRoutes
// ##################################################################################################
export class StateHistoryRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private stateHistoryController : StateHistoryController = new StateHistoryController();
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
    this.router.post('', this.stateHistoryController.create);
    this.router.post('/Multiple', this.stateHistoryController.createList);

    // GET
    this.router.get('', this.stateHistoryController.getAll);
    this.router.get('/:id', this.stateHistoryController.get);

    // PUT
    this.router.put('/:id', this.stateHistoryController.update);

    // PATCH
    this.router.patch('/:id', this.stateHistoryController.modify);

    // DELETE
    this.router.delete('/:id', this.stateHistoryController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
