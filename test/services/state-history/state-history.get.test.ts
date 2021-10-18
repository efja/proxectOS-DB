// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { StateHistory } from '../../../src/models/state-history.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - StateHistorys (GET)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.statesHistory, true);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('Tódolos StateHistorys:', async() => {
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

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataList.statesHistory.length);

        expect(total).toBe(dataList.statesHistory.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const stateHistory = dataList.statesHistory[0] as StateHistory;

        expect(error).toBeUndefined();

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

    test(`StateHistory inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.statesHistory[0].id}${FAKE_TEXT}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.GET_SINGLE'));
    });
});