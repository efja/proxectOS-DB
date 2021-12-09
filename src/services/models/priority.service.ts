// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from '../base.service';
import { Priority } from '../../models/priority.model';

// ##################################################################################################
// ## CLASE PriorityService
// ##################################################################################################
export class PriorityService extends BaseService<Priority> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(Priority)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}