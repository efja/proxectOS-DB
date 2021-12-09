/* eslint-disable @typescript-eslint/no-explicit-any */
// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { ResourceService } from '../../services/models/resource.service';
import { Resource } from '../../models/resource.model';
import { BaseController } from '../base.controller';

// ##################################################################################################
// ## CONSTANTES
// ##################################################################################################
const TRANSLATION_NAME_MODEL : string = 'RESOURCE';

// ##################################################################################################
// ## CLASE ResourceController
// ##################################################################################################
export class ResourceController extends BaseController<Resource> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected TRANSLATION_NAME_MODEL : string = TRANSLATION_NAME_MODEL;
  protected minimumAttributes      : string[] = [
    'name',
    'description',
    'scale',
    'unitCost',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(Resource, ResourceService)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}