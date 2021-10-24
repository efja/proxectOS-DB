// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { Resource } from '../../../src/models/resource.model';

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
describe('1: Probas DATOS API - Resources (PUT)', () => {
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

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.resources);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar Resource: <${dataList.resources[0].id}>`, async() => {
        const resource0 = new Resource(dataList.resources[0]);
        const resource1 = new Resource(dataList.resources[0]);

        // Modificase o modelo Resource (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        resource1.name = resource1.name + FAKE_TEXT;
        resource1.description = resource1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}`).send(resource1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
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
});

describe('1: Probas DATOS API - Resources ERROS (PUT)', () => {
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

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.resources);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************

    test(`2.1: Actualizar Resource con datos erróneos:`, async() => {
        const resource0 = new Resource(dataList.resources[0]);

        // Modificase o modelo Resource
        resource0.name = resource0.name + FAKE_TEXT;

        const resource1 = resource0 as any;
        resource1.createdAt = resource0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${resource0.id}`).send(resource1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('RESOURCE.NAME'), id: resource0.id }));
    });

    test(`2.2: Actualizar Resource que non existe:`, async() => {
        const resource0 = new Resource(dataList.resources[0]);

        // Modificase o modelo Resource
        resource0.name = resource0.name + FAKE_TEXT;

        do {
            resource0.id = new ObjectId();
        } while (resource0.id == dataList.resources[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${resource0.id}`).send(resource0);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_MALE', { entity: i18next.t('RESOURCE.NAME'), id: resource0.id }));
    });
});
