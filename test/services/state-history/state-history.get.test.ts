// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
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

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
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

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('STATE_HISTORY.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos StateHistorys con parámetros de filtrado:', async() => {
        const valueFilter = 'Traballando';
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ log: "ASC" }],
                log: valueFilter
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

        const statesHistory: StateHistory[] = (dataList.statesHistory as StateHistory[]).filter(item => item.log.includes(valueFilter));

        const dataLength = statesHistory.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(statesHistory[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('STATE_HISTORY.NAME_PLURAL') }));
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

        expect(data.newState).toBeDefined();
        expect(data.newState).toBe(stateHistory.newState.id);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory.id }));
    });

    test(`1.4: Consultar StateHistory: <${dataList.statesHistory[0].id}> con parámetros de filtrado`, async() => {
        const stateHistory = dataList.statesHistory[0] as StateHistory;

        const queryParameters = qs.stringify(
            {
                log: stateHistory.log
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${stateHistory.id}?${queryParameters}`);
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
        expect(data.id).toBe(stateHistory.id);

        expect(data.log).toBeDefined();
        expect(data.log).toBe(stateHistory.log);

        expect(data.newState).toBeDefined();
        expect(data.newState).toBe(stateHistory.newState.id);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory.id }));
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
                log: FAKE_TEXT
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
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('STATE_HISTORY.NAME_PLURAL') }));
    });

    test(`2.2: Consultar StateHistory: <${dataList.statesHistory[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                log: FAKE_TEXT
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
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('STATE_HISTORY.NAME'), id: dataList.statesHistory[0].id }));
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
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('STATE_HISTORY.NAME'), id: `${dataList.statesHistory[0].id}${FAKE_TEXT}` }));
    });
});
