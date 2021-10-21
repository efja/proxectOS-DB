// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { Requirement } from '../../../src/models/requirement.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Requirements (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "requirements";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.requirements);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
        await app.stop();

		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Actualizar Requirement: <${dataList.requirements[0].id}>`, async() => {
        const requirement0 = dataList.requirements[0] as Requirement;
        const requirement1 = dataList.requirements[0] as Requirement;

        // Modificase o modelo Requirement
        requirement1.name = requirement1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(requirement0, requirement1);

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
        expect(data.name).not.toBe(requirement0.name);
        expect(data.name).toBe(requirement1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(requirement0.id);
        expect(data.id).toBe(requirement1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(requirement0.description);
        expect(data.description).toBe(requirement1.description);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(requirement0.startDate);
        expect(data.startDate).toBe(requirement1.startDate);
        expect(data.targetFinishDate).toBe(requirement0.targetFinishDate);
        expect(data.targetFinishDate).toBe(requirement1.targetFinishDate);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Requirement con datos erróneos:`, async() => {
        const requirement0 = dataList.requirements[0] as Requirement;
        const requirement1 = dataList.requirements[0] as Requirement;

        // Modificase o modelo Requirement
        requirement1.name = requirement1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(requirement0, requirement1);

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

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.ERROR.UPDATE'));
    });
});
