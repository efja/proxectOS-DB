// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

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

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - Resources (GET)', () => {
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
    test('1.1: Consultar tódolos Resources:', async() => {
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

        const dataLength = dataList.resources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.resources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('RESOURCE.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos Resources con parámetros de filtrado:', async() => {
        const valueFilter = 'Hora';
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ name: "ASC" }],
                name: valueFilter
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

        const resources: Resource[] = (dataList.resources as Resource[]).filter(item => item.name.includes(valueFilter));

        const dataLength = resources.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(resources[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('RESOURCE.NAME_PLURAL') }));
    });

    test(`1.3: Consultar Resource: <${dataList.resources[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const resource = dataList.resources[0] as Resource;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(resource.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(resource.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(resource.description);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('RESOURCE.NAME'), id: resource.id }));
    });

    test(`1.4: Consultar Resource: <${dataList.resources[0].id}> con parámetros de filtrado`, async() => {
        const resource = dataList.resources[0] as Resource;

        const queryParameters = qs.stringify(
            {
                name: resource.name
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${resource.id}?${queryParameters}`);
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
        expect(data.id).toBe(resource.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(resource.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(resource.description);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('RESOURCE.NAME'), id: resource.id }));
    });
});

describe('2: Probas DATOS API - Resources ERROS (GET)', () => {
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
    test('2.1: Consultar tódolos Resources con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
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

        const dataLength = dataList.resources.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('RESOURCE.NAME_PLURAL') }));
    });

    test(`2.2: Consultar Resource: <${dataList.resources[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('RESOURCE.NAME'), id: `${dataList.resources[0].id}` }));
    });

    test(`2.3: Consultar Resource inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('RESOURCE.NAME'), id: `${dataList.resources[0].id}${FAKE_TEXT}` }));
    });
});
