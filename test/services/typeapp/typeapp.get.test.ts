// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import { TypeApp } from '../../../src/models/typeapp.model';

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
describe('1: Probas DATOS API - Types (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "types";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.types, true);
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
    test('1.1: Consultar tódolos Types:', async() => {
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

        const dataLength = dataList.types.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.types[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('TYPE.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos Types con parámetros de filtrado:', async() => {
        const valueFilter = 'Dependencia';
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

        const types: TypeApp[] = (dataList.types as TypeApp[]).filter(item => item.name.includes(valueFilter));

        const dataLength = types.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(types[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('TYPE.NAME_PLURAL') }));
    });

    test(`1.3: Consultar TypeApp: <${dataList.types[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.types[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const type = dataList.types[0] as TypeApp;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(type.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(type.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(type.description);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('TYPE.NAME'), id: type.id }));
    });

    test(`1.4: Consultar TypeApp: <${dataList.types[0].id}> con parámetros de filtrado`, async() => {
        const type = dataList.types[0] as TypeApp;

        const queryParameters = qs.stringify(
            {
                name: type.name
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${type.id}?${queryParameters}`);
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
        expect(data.id).toBe(type.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(type.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(type.description);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('TYPE.NAME'), id: type.id }));
    });
});

describe('2: Probas DATOS API - Types ERROS (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "types";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.types, true);
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
    test('2.1: Consultar tódolos Types con parámetros de filtrado :', async() => {
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

        const dataLength = dataList.types.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('TYPE.NAME_PLURAL') }));
    });

    test(`2.2: Consultar TypeApp: <${dataList.types[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: FAKE_TEXT
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.types[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('TYPE.NAME'), id: `${dataList.types[0].id}` }));
    });

    test(`2.3: Consultar TypeApp inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.types[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('TYPE.NAME'), id: `${dataList.types[0].id}${FAKE_TEXT}` }));
    });
});
