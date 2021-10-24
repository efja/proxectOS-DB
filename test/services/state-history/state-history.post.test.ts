// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { StateHistory } from '../../../src/models/state-history.model';
import { User } from "../../../src/models/user.model";

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - StateHistorys (POST)', () => {
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
        await db.createCollections();
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
    test(`1.1: Crear StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const stateHistory = dataList.statesHistory[0] as StateHistory;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(stateHistory);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stateHistory.id);

        expect(data.log).toBeDefined();
        expect(data.log).toBe(stateHistory.log);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).toBe(stateHistory.newState.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory.oldState.id);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('STATE_HISTORY.NAME') }));
    });

    test('1.2: Crear lista de StateHistorys:', async() => {
        const statesHistory = [
            new StateHistory(dataList.statesHistory[0]),
            new StateHistory(dataList.statesHistory[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        statesHistory[0]._id = "616c6b4c9c7900e7011c9615";
        statesHistory[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        statesHistory[1]._id = "616c6b6602067b3bd0d5ffbc";
        statesHistory[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(statesHistory);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = statesHistory.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(statesHistory[0].id);
        expect(data[0].id).not.toBe(statesHistory[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(statesHistory[1].id);
        expect(data[1].id).not.toBe(statesHistory[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('STATE_HISTORY.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - StateHistorys ERROS (POST)', () => {
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
    test(`2.1: Crear StateHistory con datos erróneos:`, async() => {
        const badStateHistory = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badStateHistory);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('STATE_HISTORY.NAME') }));
    });

    test(`2.2: Crear StateHistory: <${dataList.statesHistory[0].id}> QUE XA EXISTE`, async() => {
        const stateHistory = dataList.statesHistory[0] as StateHistory;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(stateHistory);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('STATE_HISTORY.NAME'), id: stateHistory.id }));
    });

    test('2.3: Crear lista de StateHistorys algúns con datos erróneos:', async() => {
        const badStateHistorys = [
            new StateHistory(dataList.statesHistory[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badStateHistorys[0]._id = "616c6b4c9c7900e7011c9615";
        badStateHistorys[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badStateHistorys[1]._id = "616c6b6602067b3bd0d5ffbc";
        badStateHistorys[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badStateHistorys);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badStateHistorys.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('STATE_HISTORY.NAME_PLURAL') }));
    });
});