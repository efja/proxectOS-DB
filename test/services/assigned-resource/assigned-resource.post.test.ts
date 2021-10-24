// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { AssignedResource } from '../../../src/models/assigned-resource.model';
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
describe('1: Probas DATOS API - AssignedResources (POST)', () => {
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
    test(`1.1: Crear AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedResource);
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
        expect(data.id).toBe(assignedResource.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(assignedResource.description);

        // Comprobanse algúns datos opcionais
        expect(data.amount).toBe(assignedResource.amount);
        expect(data.amount).toBe(assignedResource.amount);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.CREATE'));
    });

    test('1.2: Crear lista de AssignedResources:', async() => {
        const assignedResources = [
            new AssignedResource(dataList.assignedResources[0]),
            new AssignedResource(dataList.assignedResources[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedResources[0]._id = "616c6b4c9c7900e7011c9615";
        assignedResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(assignedResources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = assignedResources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedResources[0].id);
        expect(data[0].id).not.toBe(assignedResources[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedResources[1].id);
        expect(data[1].id).not.toBe(assignedResources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.CREATE_LIST'));
    });
});

describe('2: Probas DATOS API - AssignedResources ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedResources";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedResources, true);
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
    test(`2.1: Crear AssignedResource con datos erróneos:`, async() => {
        const badAssignedResource = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedResource);
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

        expect(error).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.CREATE'));
    });

    test(`2.2: Crear AssignedResource: <${dataList.assignedResources[0].id}> QUE XA EXISTE`, async() => {
        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedResource);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: assignedResource.id }));
    });

    test('2.3: Crear lista de AssignedResources algúns con datos erróneos:', async() => {
        const badAssignedResources = [
            new AssignedResource(dataList.assignedResources[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedResources[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badAssignedResources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badAssignedResources.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.CREATE_LIST'));
    });
});