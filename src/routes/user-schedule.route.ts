// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { UserScheduleController } from '../controllers/user-schedule.controller';

// ####################################################################################################
// ## CLASE UserScheduleRoutes
// ####################################################################################################
export class UserScheduleRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private userScheduleController : UserScheduleController = new UserScheduleController();
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
    this.router.post('', this.userScheduleController.create);
    this.router.post('/Multiple', this.userScheduleController.createList);

    // GET
    this.router.get('', this.userScheduleController.getAll);
    this.router.get('/:id', this.userScheduleController.get);

    // PUT
    this.router.put('/:id', this.userScheduleController.update);

    // PATCH
    this.router.patch('/:id', this.userScheduleController.modify);

    // DELETE
    this.router.delete('/:id', this.userScheduleController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
