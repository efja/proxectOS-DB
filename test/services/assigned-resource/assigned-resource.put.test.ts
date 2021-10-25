// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { AssignedResource } from '../../../src/models/assigned-resource.model';

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
describe('1: Probas DATOS API - AssignedResources (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedResources";

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
        await db.inicializeData(dataList.assignedResources);
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
    test(`1.1: Actualizar AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const assignedResource0 = new AssignedResource(dataList.assignedResources[0]);
        const assignedResource1 = new AssignedResource(dataList.assignedResources[0]);

        // Modificase o modelo AssignedResource (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        assignedResource1.description = assignedResource1.description + FAKE_TEXT;
        assignedResource1.unitCost = assignedResource1.unitCost + 10;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}`).send(assignedResource1);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(assignedResource0.description);
        expect(data.description).toBe(assignedResource1.description);

        expect(data.unitCost).toBeDefined();
        expect(data.unitCost).not.toBe(assignedResource0.unitCost);
        expect(data.unitCost).toBe(assignedResource1.unitCost);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedResource0.id);
        expect(data.id).toBe(assignedResource1.id);

        // Comprobanse algúns datos opcionais
        expect(data.amount).toBe(assignedResource0.amount);
        expect(data.amount).toBe(assignedResource1.amount);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: assignedResource1.id }));
    });
});

describe('1: Probas DATOS API - AssignedResources ERROS (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedResources";

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
        await db.inicializeData(dataList.assignedResources);
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

    test(`2.1: Actualizar AssignedResource con datos erróneos:`, async() => {
        const assignedResource0 = new AssignedResource(dataList.assignedResources[0]);

        // Modificase o modelo AssignedResource
        assignedResource0.description = assignedResource0.description + FAKE_TEXT;

        const assignedResource1 = assignedResource0 as any;
        assignedResource1.unitCost = assignedResource0.description + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedResource0.id}`).send(assignedResource1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: assignedResource0.id }));
    });

    test(`2.2: Actualizar AssignedResource que non existe:`, async() => {
        const assignedResource0 = new AssignedResource(dataList.assignedResources[0]);

        // Modificase o modelo AssignedResource
        assignedResource0.description = assignedResource0.description + FAKE_TEXT;

        do {
            assignedResource0.id = new ObjectId();
        } while (assignedResource0.id == dataList.assignedResources[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedResource0.id}`).send(assignedResource0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: assignedResource0.id }));
    });
});
