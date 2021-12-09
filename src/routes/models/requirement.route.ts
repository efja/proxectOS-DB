// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { Router, IRouter } from 'express';

import { RequirementController } from '../../controllers/models/requirement.controller';

// ##################################################################################################
// ## CLASE RequirementRoutes
// ##################################################################################################
export class RequirementRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private requirementController : RequirementController = new RequirementController();
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
    this.router.post('', this.requirementController.create);
    this.router.post('/Multiple', this.requirementController.createList);

    // GET
    this.router.get('', this.requirementController.getAll);
    this.router.get('/:id', this.requirementController.get);

    // PUT
    this.router.put('/:id', this.requirementController.update);

    // PATCH
    this.router.patch('/:id', this.requirementController.modify);

    // DELETE
    this.router.delete('/:id', this.requirementController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
