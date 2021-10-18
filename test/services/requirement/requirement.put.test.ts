// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Requirement } from '../../../src/models/requirement.model';

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
describe('Probas DATOS API - Requirements (PUT)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.requirements);
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
    test(`Actualizar Requirement: <${dataList.requirements[0].id}>`, async() => {
        const requirement0 = dataList.requirements[0] as Requirement;
        const requirement1 = dataList.requirements[0] as Requirement;

        // Modificase o modelo Requirement (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        requirement1.name = requirement1.name + FAKE_TEXT;
        requirement1.description = requirement1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(requirement1);
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

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(requirement0.description);
        expect(data.description).toBe(requirement1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(requirement0.id);
        expect(data.id).toBe(requirement1.id);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(requirement0.startDate);
        expect(data.startDate).toBe(requirement1.startDate);
        expect(data.targetFinishDate).toBe(requirement0.targetFinishDate);
        expect(data.targetFinishDate).toBe(requirement1.targetFinishDate);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Requirement con datos erróneos:`, async() => {
        const requirement0 = dataList.requirements[0] as Requirement;

        // Modificase o modelo Requirement
        requirement0.name = requirement0.name + FAKE_TEXT;

        const requirement1 = requirement0 as any;
        requirement1.startDate = requirement0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(requirement1);
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
