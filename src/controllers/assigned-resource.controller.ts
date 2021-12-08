/* eslint-disable @typescript-eslint/no-explicit-any */
// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { AssignedResourceService } from '../services/assigned-resource.service';
import { AssignedResource } from '../models/assigned-resource.model';
import { BaseController } from './base.controller';

// ##################################################################################################
// ## CONSTANTES
// ##################################################################################################
const TRANSLATION_NAME_MODEL : string = 'ASSIGNED_RESOURCE';

// ##################################################################################################
// ## CLASE AssignedResourceController
// ##################################################################################################
export class AssignedResourceController extends BaseController<AssignedResource> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected TRANSLATION_NAME_MODEL : string = TRANSLATION_NAME_MODEL;
  protected minimumAttributes      : string[] = [
    'description',
    'amount',
    'unitCost',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(AssignedResource, AssignedResourceService)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
