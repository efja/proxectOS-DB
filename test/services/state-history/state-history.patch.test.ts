// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import ooPatch from 'json8-patch';
import { ObjectId } from "@mikro-orm/mongodb";

import { StateHistory } from '../../../src/models/state-history.model';
import { State } from "../../../src/models/state.model";

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
describe('1: Probas DATOS API - StateHistorys (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const stateHistory0 = new StateHistory(dataList.statesHistory[0]);
        const stateHistory1 = dataList.statesHistory[0] as any;

        const stateHistory0newStateId = stateHistory0.newState.id;
        // Modificase o modelo StateHistory
        stateHistory0.log = stateHistory0.log + FAKE_TEXT;

        // Modificase o modelo AssignedUser
        if (stateHistory1.newState != dataList.states[0].id) {
            stateHistory1.newState = dataList.states[0].id;
        } else {
            stateHistory1.newState = dataList.states[1].id;
        }

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = ooPatch.diff(stateHistory0, stateHistory1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${stateHistory0.id}`).send(objPatch);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
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

        expect(data.newState).toBeDefined();
        expect(data.newState).not.toBe(stateHistory0newStateId);
        expect(data.newState).toBe(stateHistory1.newState);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory1.id }));
    });

});

describe('2: Probas DATOS API - StateHistorys ERROS (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Actualizar StateHistory con datos erróneos:`, async() => {
        const stateHistory0 = new StateHistory(dataList.statesHistory[0]);
        const stateHistory1 = new StateHistory(dataList.statesHistory[0]);

        // Modificase o modelo StateHistory
        stateHistory1.log = stateHistory1.log + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = ooPatch.diff(stateHistory0, stateHistory1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${stateHistory0.id}`).send(objPatch);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);
        expect(data).toBeUndefined();

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory0.id }));
    });

    test(`2.2: Actualizar StateHistory que non existe:`, async() => {
        const stateHistory0 = new StateHistory(dataList.statesHistory[0]);

        // Modificase o modelo StateHistory
        stateHistory0.log = stateHistory0.log + FAKE_TEXT;

        do {
            stateHistory0._id = new ObjectId();
        } while (stateHistory0._id == dataList.statesHistory[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${stateHistory0.id}`).send(stateHistory0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory0.id }));
    });
});
