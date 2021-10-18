// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Resource } from '../../../src/models/resource.model';
import { User } from "../../../src/models/user.model";

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Resources (POST)', () => {
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
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Crear Resource: <${dataList.resources[0].id}>`, async() => {
        const resource = dataList.resources[0] as Resource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(resource);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

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

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear Resource con datos erróneos:`, async() => {
        const badResource = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badResource);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de Resources:', async() => {
        const resources = [
            dataList.resources[0] as Resource,
            dataList.resources[0] as Resource,
        ];

        // Se cambian los identificadores para evitar conflictos
        resources[0]._id = "616c6b4c9c7900e7011c9615";
        resources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        resources[1]._id = "616c6b6602067b3bd0d5ffbc";
        resources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(resources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(resources.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(resources[0]);
        expect(data[0].id).not.toBe(resources[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(resources[1]);
        expect(data[1].id).not.toBe(resources[0]);

        expect(total).toBe(dataList.resources.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de Resources algúns con datos erróneos:', async() => {
        const badResources = [
            dataList.resources[0] as Resource,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badResources[0]._id = "616c6b4c9c7900e7011c9615";
        badResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        badResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badResources);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badResources.length);

        expect(total).not.toBe(badResources.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.ERROR.CREATE_LIST'));
    });
});
