// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Resource } from '../../../src/models/resource.model';
import { User } from "../../../src/models/user.model";

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - Resources (POST)', () => {
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
        await db.createCollections();
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
    test(`1.1: Crear Resource: <${dataList.resources[0].id}>`, async() => {
        const resource = dataList.resources[0] as Resource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(resource);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(resource.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(resource.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(resource.description);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('RESOURCE.NAME') }));
    });

    test('1.2: Crear lista de Resources:', async() => {
        const resources = [
            new Resource(dataList.resources[0]),
            new Resource(dataList.resources[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        resources[0]._id = "616c6b4c9c7900e7011c9615";
        resources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        resources[1]._id = "616c6b6602067b3bd0d5ffbc";
        resources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(resources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = resources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(resources[0].id);
        expect(data[0].id).not.toBe(resources[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(resources[1].id);
        expect(data[1].id).not.toBe(resources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('RESOURCE.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - Resources ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "resources";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.resources, true);
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
    test(`2.1: Crear Resource con datos erróneos:`, async() => {
        const badResource = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badResource);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('RESOURCE.NAME') }));
    });

    test(`2.2: Crear Resource: <${dataList.resources[0].id}> QUE XA EXISTE`, async() => {
        const resource = dataList.resources[0] as Resource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(resource);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('RESOURCE.NAME'), id: resource.id }));
    });

    test('2.3: Crear lista de Resources algúns con datos erróneos:', async() => {
        const badResources = [
            new Resource(dataList.resources[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badResources[0]._id = "616c6b4c9c7900e7011c9615";
        badResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        badResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badResources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badResources.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('RESOURCE.NAME_PLURAL') }));
    });
});