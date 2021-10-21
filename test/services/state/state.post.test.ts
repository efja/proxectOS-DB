// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { State } from '../../../src/models/state.model';
import { User } from "../../../src/models/user.model";

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
describe('Probas DATOS API - States (POST)', () => {
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
	});

	beforeEach(async () => {
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Crear State: <${dataList.states[0].id}>`, async() => {
        const state = dataList.states[0] as State;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(state);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(state.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(state.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(state.description);

        expect(message).toBe(i18next.t('STATE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear State con datos erróneos:`, async() => {
        const badState = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badState);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('STATE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de States:', async() => {
        const states = [
            dataList.states[0] as State,
            dataList.states[0] as State,
        ];

        // Se cambian los identificadores para evitar conflictos
        states[0]._id = "616c6b4c9c7900e7011c9615";
        states[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        states[1]._id = "616c6b6602067b3bd0d5ffbc";
        states[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(states);
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

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(states.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(states[0]);
        expect(data[0].id).not.toBe(states[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(states[1]);
        expect(data[1].id).not.toBe(states[0]);

        expect(total).toBe(dataList.states.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de States algúns con datos erróneos:', async() => {
        const badStates = [
            dataList.states[0] as State,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badStates[0]._id = "616c6b4c9c7900e7011c9615";
        badStates[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badStates[1]._id = "616c6b6602067b3bd0d5ffbc";
        badStates[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badStates);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badStates.length);

        expect(total).not.toBe(badStates.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE.SERVICE.ERROR.CREATE_LIST'));
    });
});
