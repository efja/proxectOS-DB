// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import { Router, IRouter } from 'express';

import { CommentAppController } from '../controllers/commentapp.controller';

// ####################################################################################################
// ## CLASE CommentAppRoutes
// ####################################################################################################
export class CommentAppRoutes {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  private commentAppController : CommentAppController = new CommentAppController();
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
    this.router.post('', this.commentAppController.create);
    this.router.post('/Multiple', this.commentAppController.createList);

    // GET
    this.router.get('', this.commentAppController.getAll);
    this.router.get('/:id', this.commentAppController.get);

    // PUT
    this.router.put('/:id', this.commentAppController.update);

    // PATCH
    this.router.patch('/:id', this.commentAppController.modify);

    // DELETE
    this.router.delete('/:id', this.commentAppController.delete);
  };

  // ************************************************************************************************
  // ** MÉTODOS
  // ************************************************************************************************
  public getRoutes = (): IRouter => {
    return this.router;
  };
}
