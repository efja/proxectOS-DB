// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { StateHistory } from '../../../src/models/state-history.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - StateHistorys (PATCH)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.statesHistory);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Actualizar StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const stateHistory0 = dataList.statesHistory[0] as StateHistory;
        const stateHistory1 = dataList.statesHistory[0] as StateHistory;

        // Modificase o modelo StateHistory
        stateHistory1.log = stateHistory1.log + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(stateHistory0, stateHistory1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stateHistory0.id);
        expect(data.id).toBe(stateHistory1.id);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).toBe(stateHistory0.newState.id);
        expect(data.newState.id).toBe(stateHistory1.newState.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory0.oldState.id);
        expect(data.oldState.id).toBe(stateHistory1.oldState.id);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar StateHistory con datos erróneos:`, async() => {
        const stateHistory0 = dataList.statesHistory[0] as StateHistory;
        const stateHistory1 = dataList.statesHistory[0] as StateHistory;

        // Modificase o modelo StateHistory
        stateHistory1.log = stateHistory1.log + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(stateHistory0, stateHistory1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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
