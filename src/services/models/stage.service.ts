// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from '../base.service';
import { Stage } from '../../models/stage.model';

// ##################################################################################################
// ## CLASE StageService
// ##################################################################################################
export class StageService extends BaseService<Stage> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected populate: string[] = [];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(Stage)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
