// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { Project } from '../../../src/models/project.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Projects (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "projects";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.projects);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Actualizar Project: <${dataList.projects[0].id}>`, async() => {
        const project0 = dataList.projects[0] as Project;
        const project1 = dataList.projects[0] as Project;

        // Modificase o modelo Project
        project1.name = project1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(project0, project1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // ** Datos cambiados
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(project0.name);
        expect(data.name).toBe(project1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(project0.id);
        expect(data.id).toBe(project1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(project0.description);
        expect(data.description).toBe(project1.description);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(project0.startDate);
        expect(data.startDate).toBe(project1.startDate);
        expect(data.targetFinishDate).toBe(project0.targetFinishDate);
        expect(data.targetFinishDate).toBe(project1.targetFinishDate);

        expect(message).toBe(i18next.t('PROJECT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Project con datos erróneos:`, async() => {
        const project0 = dataList.projects[0] as Project;
        const project1 = dataList.projects[0] as Project;

        // Modificase o modelo Project
        project1.name = project1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(project0, project1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);
        expect(data).toBeUndefined();

        expect(message).toBe(i18next.t('PROJECT.SERVICE.ERROR.UPDATE'));
    });
});
