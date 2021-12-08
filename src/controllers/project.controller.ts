/* eslint-disable @typescript-eslint/no-explicit-any */
// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import { ProjectService } from '../services/project.service';
import { Project } from '../models/project.model';
import { BaseController } from './base.controller';

// ##################################################################################################
// ## CONSTANTES
// ##################################################################################################
const TRANSLATION_NAME_MODEL : string = 'PROJECT';

// ##################################################################################################
// ## CLASE ProjectController
// ##################################################################################################
export class ProjectController extends BaseController<Project> {
  // ************************************************************************************************
  // ** ATRIBUTOS
  // ************************************************************************************************
  protected TRANSLATION_NAME_MODEL : string = TRANSLATION_NAME_MODEL;
  protected minimumAttributes      : string[] = [
    'name',
    'description',
  ];

  // ************************************************************************************************
  // ** CONSTRUTOR
  // ************************************************************************************************
  constructor() {
    super(Project, ProjectService)
  }

  // ************************************************************************************************
  // ** UTILIDADES
  // ************************************************************************************************
}
