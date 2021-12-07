// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { Priority } from '../../../src/models/priority.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - Priorities (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "priorities";

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
        await db.inicializeData(dataList.priorities);
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
    test(`1.1: Actualizar Priority: <${dataList.priorities[0].id}>`, async() => {
        const priority0 = new Priority(dataList.priorities[0]);
        const priority1 = new Priority(dataList.priorities[0]);

        // Modificase o modelo Priority (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        priority1.name = priority1.name + FAKE_TEXT;
        priority1.description = priority1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.priorities[0].id}`).send(priority1);
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
        expect(data.name).not.toBe(priority0.name);
        expect(data.name).toBe(priority1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(priority0.description);
        expect(data.description).toBe(priority1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(priority0.id);
        expect(data.id).toBe(priority1.id);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('PRIORITY.NAME'), id: dataList.priorities[0].id }));
    });
});

describe('1: Probas DATOS API - Priorities ERROS (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "priorities";

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
        await db.inicializeData(dataList.priorities);
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

    test(`2.1: Actualizar Priority con datos erróneos:`, async() => {
        const priority0 = new Priority(dataList.priorities[0]);

        // Modificase o modelo Priority
        priority0.name = priority0.name + FAKE_TEXT;

        const priority1 = priority0 as any;
        priority1.createdAt = priority0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${priority0.id}`).send(priority1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('PRIORITY.NAME'), id: priority0.id }));
    });

    test(`2.2: Actualizar Priority que non existe:`, async() => {
        const priority0 = new Priority(dataList.priorities[0]);

        // Modificase o modelo Priority
        priority0.name = priority0.name + FAKE_TEXT;

        do {
            priority0._id = new ObjectId();
        } while (priority0._id == dataList.priorities[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${priority0.id}`).send(priority0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('PRIORITY.NAME'), id: priority0.id }));
    });
});