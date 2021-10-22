// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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
describe('1: Probas DATOS API - StateHistorys (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "statesHistory";

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
        await db.inicializeData(dataList.statesHistory);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
        await app.stop();

		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const stateHistory0 = dataList.statesHistory[0] as StateHistory;
        const stateHistory1 = dataList.statesHistory[0] as StateHistory;

        // Modificase o modelo StateHistory (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        stateHistory1.log = stateHistory1.log + FAKE_TEXT;
        stateHistory1.newState.id = stateHistory1.newState.id + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(stateHistory1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // ** Datos cambiados
        expect(data.log).toBeDefined();
        expect(data.log).not.toBe(stateHistory0.log);
        expect(data.log).toBe(stateHistory1.log);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).not.toBe(stateHistory0.newState.id);
        expect(data.newState.id).toBe(stateHistory1.newState.id);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stateHistory0.id);
        expect(data.id).toBe(stateHistory1.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory0.oldState.id);
        expect(data.oldState.id).toBe(stateHistory1.oldState.id);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar StateHistory con datos erróneos:`, async() => {
        const stateHistory0 = dataList.statesHistory[0] as StateHistory;

        // Modificase o modelo StateHistory
        stateHistory0.log = stateHistory0.log + FAKE_TEXT;

        const stateHistory1 = stateHistory0 as any;
        stateHistory1.oldState.id = stateHistory0.log + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(stateHistory1);
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

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.UPDATE'));
    });
});
