// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { PerformanceAppController } from '../controllers/performanceapp.controller';

// ####################################################################################################
// ## CLASE PerformanceAppRoutes
// ####################################################################################################
export class PerformanceAppRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private performanceAppController : PerformanceAppController = new PerformanceAppController();
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
    this.router.post('', this.performanceAppController.create);
    this.router.post('/Multiple', this.performanceAppController.createList);

    // GET
    this.router.get('', this.performanceAppController.getAll);
    this.router.get('/:id', this.performanceAppController.get);

    // PUT
    this.router.put('/:id', this.performanceAppController.update);

    // PATCH
    this.router.patch('/:id', this.performanceAppController.modify);

    // DELETE
    this.router.delete('/:id', this.performanceAppController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
