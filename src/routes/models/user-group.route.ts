// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { UserGroupController } from '../../controllers/models/user-group.controller';

// ##################################################################################################
// ## CLASE UserGroupRoutes
// ##################################################################################################
export class UserGroupRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private userGroupController : UserGroupController = new UserGroupController();
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
    this.router.post('', this.userGroupController.create);
    this.router.post('/Multiple', this.userGroupController.createList);

    // GET
    this.router.get('', this.userGroupController.getAll);
    this.router.get('/:id', this.userGroupController.get);

    // PUT
    this.router.put('/:id', this.userGroupController.update);

    // PATCH
    this.router.patch('/:id', this.userGroupController.modify);

    // DELETE
    this.router.delete('/:id', this.userGroupController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
