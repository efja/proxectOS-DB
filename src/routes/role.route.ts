// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { RoleController } from '../controllers/role.controller';

// ####################################################################################################
// ## CLASE RoleRoutes
// ####################################################################################################
export class RoleRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private roleController : RoleController = new RoleController();
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
    this.router.post('', this.roleController.create);
    this.router.post('/Multiple', this.roleController.createList);

    // GET
    this.router.get('', this.roleController.getAll);
    this.router.get('/:id', this.roleController.get);

    // PUT
    this.router.put('/:id', this.roleController.update);

    // PATCH
    this.router.patch('/:id', this.roleController.modify);

    // DELETE
    this.router.delete('/:id', this.roleController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
