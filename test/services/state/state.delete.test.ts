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
describe('1: Probas DATOS API - States (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "states";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.states, true);
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
    test(`1.1: Borrar State: <${dataList.states[0].id}>`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.states[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const state = dataList.states[0] as State;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(state.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(state.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(state.description);

        expect(message).toBe(i18next.t('SUCCESS.DELETE', { entity: i18next.t('STATE.NAME') }));

        // --------------------------------------------------------------------------------------------
        // -- COMPROBASE QUE A ENTIDADE XA NON EXISTE NA BD
        // --------------------------------------------------------------------------------------------
        const responseGet = await request.get(`${API_BASE}/${ENDPOINT}/${data.id}`);
        const {
            code    : codeGet,
            data    : dataGet,
            message : messageGet,
            error   : errorGet,
        } = responseGet.body

        expect(errorGet).toBeDefined();
        expect(messageGet).toBeUndefined();

        expect(responseGet.status).toBe(HttpStatus.NOT_FOUND);
        expect(codeGet).toBe(HttpStatus.NOT_FOUND);
        expect(dataGet).toBeUndefined();

        expect(errorGet).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('STATE.NAME') }));
    });
});

describe('2: Probas DATOS API - States ERROS (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "states";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.states, true);
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
    test(`2.1: Borrar State inexistente:`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.states[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.DELETE', { entity: i18next.t('STATE.NAME') }));
    });
});
