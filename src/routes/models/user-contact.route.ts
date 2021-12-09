// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { UserContactController } from '../../controllers/models/user-contact.controller';

// ##################################################################################################
// ## CLASE UserContactRoutes
// ##################################################################################################
export class UserContactRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private userContactController : UserContactController = new UserContactController();
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
    this.router.post('', this.userContactController.create);
    this.router.post('/Multiple', this.userContactController.createList);

    // GET
    this.router.get('', this.userContactController.getAll);
    this.router.get('/:id', this.userContactController.get);

    // PUT
    this.router.put('/:id', this.userContactController.update);

    // PATCH
    this.router.patch('/:id', this.userContactController.modify);

    // DELETE
    this.router.delete('/:id', this.userContactController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
