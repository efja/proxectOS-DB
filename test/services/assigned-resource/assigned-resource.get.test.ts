// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

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
describe('1: Probas DATOS API - AssignedResources (GET)', () => {
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
		// await db.dropAllData(dataList.allModels);
		// await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('1.1: Consultar tódolos AssignedResources:', async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.assignedResources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.assignedResources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('ASSIGNED_RESOURCE.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos AssignedResources con parámetros de filtrado:', async() => {
        const valueFilter = 26;
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ amount: "ASC" }],
                unitCost: valueFilter
            },
            { arrayFormat: 'repeat' }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const assignedResources: AssignedResource[] = (dataList.assignedResources as AssignedResource[]).filter(item => item.unitCost == valueFilter);

        const dataLength = assignedResources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(assignedResources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('ASSIGNED_RESOURCE.NAME_PLURAL') }));
    });

    test(`1.3: Consultar AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedResource.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(assignedResource.description);

        expect(data.amount).toBeDefined();
        expect(data.amount).toBe(assignedResource.amount);

        expect(data.resource).toBeDefined();
        expect(data.resource).toBe(assignedResource.resource.id);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: assignedResource.id }));
    });

    test(`1.4: Consultar AssignedResource: <${dataList.assignedResources[0].id}> con parámetros de filtrado`, async() => {
        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        const queryParameters = qs.stringify(
            {
                unitCost: assignedResource.unitCost
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedResource.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(assignedResource.description);

        expect(data.amount).toBeDefined();
        expect(data.amount).toBe(assignedResource.amount);

        expect(data.resource).toBeDefined();
        expect(data.resource).toBe(assignedResource.resource.id);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: dataList.assignedResources[0].id }));
    });
});

describe('2: Probas DATOS API - AssignedResources ERROS (GET)', () => {
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
    test('2.1: Consultar tódolos AssignedResources con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$regex': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.assignedResources.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('ASSIGNED_RESOURCE.NAME_PLURAL') }));
    });

    test(`2.2: Consultar AssignedResource: <${dataList.assignedResources[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$regex': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: dataList.assignedResources[0].id }));
    });

    test(`2.3: Consultar AssignedResource inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_RESOURCE.NAME'), id: `${dataList.assignedResources[0].id}${FAKE_TEXT}` }));
    });
});
