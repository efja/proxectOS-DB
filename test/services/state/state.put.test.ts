// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { State } from '../../../src/models/state.model';

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
describe('Probas DATOS API - States (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "states";

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
        await db.inicializeData(dataList.states);
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
    test(`Actualizar State: <${dataList.states[0].id}>`, async() => {
        const state0 = dataList.states[0] as State;
        const state1 = dataList.states[0] as State;

        // Modificase o modelo State (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        state1.name = state1.name + FAKE_TEXT;
        state1.description = state1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(state1);
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
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(state0.name);
        expect(data.name).toBe(state1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(state0.description);
        expect(data.description).toBe(state1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(state0.id);
        expect(data.id).toBe(state1.id);

        expect(message).toBe(i18next.t('STATE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar State con datos erróneos:`, async() => {
        const state0 = dataList.states[0] as State;

        // Modificase o modelo State
        state0.name = state0.name + FAKE_TEXT;

        const state1 = state0 as any;
        state1.startDate = state0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(state1);
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

        expect(message).toBe(i18next.t('STATE.SERVICE.ERROR.UPDATE'));
    });
});
