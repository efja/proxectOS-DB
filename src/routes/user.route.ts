// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';
import { UserController } from '../controllers/user.controller';


// ####################################################################################################
// ## CLASE UserRoutes
// ####################################################################################################
export class UserRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private userController : UserController = new UserController();
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
    this.router.post('', this.userController.create);
    this.router.post('/Multiple', this.userController.createList);

    // GET
    this.router.get('', this.userController.getAll);
    this.router.get('/:id', this.userController.get);

    // PUT
    this.router.put('/:id', this.userController.update);

    // PATCH
    this.router.patch('/:id', this.userController.modify);

    // DELETE
    this.router.delete('/:id', this.userController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
