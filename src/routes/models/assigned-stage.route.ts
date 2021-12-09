// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';
import { AssignedStageController } from '../../controllers/models/assigned-stage.controller';

// ##################################################################################################
// ## CLASE AssignedStageRoutes
// ##################################################################################################
export class AssignedStageRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private assignedStageController : AssignedStageController = new AssignedStageController();
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
    this.router.post('', this.assignedStageController.create);
    this.router.post('/Multiple', this.assignedStageController.createList);

    // GET
    this.router.get('', this.assignedStageController.getAll);
    this.router.get('/:id', this.assignedStageController.get);

    // PUT
    this.router.put('/:id', this.assignedStageController.update);

    // PATCH
    this.router.patch('/:id', this.assignedStageController.modify);

    // DELETE
    this.router.delete('/:id', this.assignedStageController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
