// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { BaseService } from '../base.service';
import { StateHistory } from '../../models/state-history.model';

// ##################################################################################################
// ## CLASE StateHistoryService
// ##################################################################################################
export class StateHistoryService extends BaseService<StateHistory> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(StateHistory)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}