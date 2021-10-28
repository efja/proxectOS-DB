// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { UserContactTypeController } from '../controllers/user-contact-type.controller';

// ####################################################################################################
// ## CLASE UserContactTypeRoutes
// ####################################################################################################
export class UserContactTypeRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private userContactTypeController : UserContactTypeController = new UserContactTypeController();
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
    this.router.post('', this.userContactTypeController.create);
    this.router.post('/Multiple', this.userContactTypeController.createList);

    // GET
    this.router.get('', this.userContactTypeController.getAll);
    this.router.get('/:id', this.userContactTypeController.get);

    // PUT
    this.router.put('/:id', this.userContactTypeController.update);

    // PATCH
    this.router.patch('/:id', this.userContactTypeController.modify);

    // DELETE
    this.router.delete('/:id', this.userContactTypeController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
