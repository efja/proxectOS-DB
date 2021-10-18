// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Resource } from '../../../src/models/resource.model';

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
describe('Probas DATOS API - Resources (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "resources";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.resources);
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
    test(`Actualizar Resource: <${dataList.resources[0].id}>`, async() => {
        const resource0 = dataList.resources[0] as Resource;
        const resource1 = dataList.resources[0] as Resource;

        // Modificase o modelo Resource (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        resource1.name = resource1.name + FAKE_TEXT;
        resource1.description = resource1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(resource1);
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
        expect(data.name).not.toBe(resource0.name);
        expect(data.name).toBe(resource1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(resource0.description);
        expect(data.description).toBe(resource1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(resource0.id);
        expect(data.id).toBe(resource1.id);

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Resource con datos erróneos:`, async() => {
        const resource0 = dataList.resources[0] as Resource;

        // Modificase o modelo Resource
        resource0.name = resource0.name + FAKE_TEXT;

        const resource1 = resource0 as any;
        resource1.startDate = resource0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(resource1);
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

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.ERROR.UPDATE'));
    });
});
