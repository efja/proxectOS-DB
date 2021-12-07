// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';
import { AssignedResourceController } from '../controllers/assigned-resource.controller';

// ##################################################################################################
// ## CLASE AssignedResourceRoutes
// ##################################################################################################
export class AssignedResourceRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private assignedResourceController : AssignedResourceController = new AssignedResourceController();
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
    this.router.post('', this.assignedResourceController.create);
    this.router.post('/Multiple', this.assignedResourceController.createList);

    // GET
    this.router.get('', this.assignedResourceController.getAll);
    this.router.get('/:id', this.assignedResourceController.get);

    // PUT
    this.router.put('/:id', this.assignedResourceController.update);

    // PATCH
    this.router.patch('/:id', this.assignedResourceController.modify);

    // DELETE
    this.router.delete('/:id', this.assignedResourceController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
