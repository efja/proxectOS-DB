// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { AssignedUserController } from '../controllers/assigned-user.controller';

// ####################################################################################################
// ## CLASE AssignedUserRoutes
// ####################################################################################################
export class AssignedUserRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private assignedUserController : AssignedUserController = new AssignedUserController();
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
    this.router.post('', this.assignedUserController.create);
    this.router.post('/Multiple', this.assignedUserController.createList);

    // GET
    this.router.get('', this.assignedUserController.getAll);
    this.router.get('/:id', this.assignedUserController.get);

    // PUT
    this.router.put('/:id', this.assignedUserController.update);

    // PATCH
    this.router.patch('/:id', this.assignedUserController.modify);

    // DELETE
    this.router.delete('/:id', this.assignedUserController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
