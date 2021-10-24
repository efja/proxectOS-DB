// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import { StateHistory } from '../../../src/models/state-history.model';

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
describe('1: Probas DATOS API - StateHistorys (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "statesHistory";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.statesHistory, true);
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
    test('1.1: Consultar tódolos StateHistorys:', async() => {
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

        const dataLength = dataList.statesHistory.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.statesHistory[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.GET_ALL'));
    });

    test('1.2: Consultar tódolos StateHistorys con parámetros de filtrado:', async() => {
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ log: "ASC" }],
                log: {'$regex': 'Traballando' }
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

        const dataLength = 1;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.statesHistory[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`1.3: Consultar StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const stateHistory = dataList.statesHistory[0] as StateHistory;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stateHistory.id);

        expect(data.log).toBeDefined();
        expect(data.log).toBe(stateHistory.log);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).toBe(stateHistory.newState.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory.oldState.id);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`1.4: Consultar StateHistory: <${dataList.statesHistory[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                log: {'$regex': 'Traballando' }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const stateHistory = dataList.statesHistory[0] as StateHistory;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stateHistory.id);

        expect(data.log).toBeDefined();
        expect(data.log).toBe(stateHistory.log);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).toBe(stateHistory.newState.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory.oldState.id);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.GET_SINGLE'));
    });
});

describe('2: Probas DATOS API - StateHistorys ERROS (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "statesHistory";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.statesHistory, true);
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
    test('2.1: Consultar tódolos StateHistorys con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                log: {'$regex': FAKE_TEXT }
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

        const dataLength = dataList.statesHistory.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeNull();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.GET_ALL'));
    });

    test(`2.2: Consultar StateHistory: <${dataList.statesHistory[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                log: {'$regex': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}?${queryParameters}`);
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
        expect(data).toBeNull();

        expect(error).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.GET_SINGLE'));
    });

    test(`2.3: Consultar StateHistory inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}${FAKE_TEXT}`);
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
        expect(data).toBeNull();

        expect(error).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.GET_SINGLE'));
    });
});
