// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { StageController } from '../controllers/stage.controller';

// ##################################################################################################
// ## CLASE StageRoutes
// ##################################################################################################
export class StageRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private stageController : StageController = new StageController();
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
    this.router.post('', this.stageController.create);
    this.router.post('/Multiple', this.stageController.createList);

    // GET
    this.router.get('', this.stageController.getAll);
    this.router.get('/:id', this.stageController.get);

    // PUT
    this.router.put('/:id', this.stageController.update);

    // PATCH
    this.router.patch('/:id', this.stageController.modify);

    // DELETE
    this.router.delete('/:id', this.stageController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
