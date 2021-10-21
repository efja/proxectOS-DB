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

    FAKE_TEXT,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - StateHistorys (POST)', () => {
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
    test(`Crear StateHistory: <${dataList.statesHistory[0].id}>`, async() => {
        const stateHistory = dataList.statesHistory[0] as StateHistory;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(stateHistory);
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
        expect(data.id).toBe(stateHistory.id);

        expect(data.log).toBeDefined();
        expect(data.log).toBe(stateHistory.log);

        expect(data.newState.id).toBeDefined();
        expect(data.newState.id).toBe(stateHistory.newState.id);

        // Comprobanse algúns datos opcionais
        expect(data.oldState.id).toBe(stateHistory.oldState.id);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear StateHistory con datos erróneos:`, async() => {
        const badStateHistory = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badStateHistory);
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

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de StateHistorys:', async() => {
        const statesHistory = [
            dataList.statesHistory[0] as StateHistory,
            dataList.statesHistory[0] as StateHistory,
        ];

        // Se cambian los identificadores para evitar conflictos
        statesHistory[0]._id = "616c6b4c9c7900e7011c9615";
        statesHistory[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        statesHistory[1]._id = "616c6b6602067b3bd0d5ffbc";
        statesHistory[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(statesHistory);
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
        expect(data).toHaveLength(statesHistory.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(statesHistory[0]);
        expect(data[0].id).not.toBe(statesHistory[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(statesHistory[1]);
        expect(data[1].id).not.toBe(statesHistory[0]);

        expect(total).toBe(dataList.statesHistory.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de StateHistorys algúns con datos erróneos:', async() => {
        const badStateHistorys = [
            dataList.statesHistory[0] as StateHistory,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badStateHistorys[0]._id = "616c6b4c9c7900e7011c9615";
        badStateHistorys[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badStateHistorys[1]._id = "616c6b6602067b3bd0d5ffbc";
        badStateHistorys[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badStateHistorys);
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
        expect(data).not.toHaveLength(badStateHistorys.length);

        expect(total).not.toBe(badStateHistorys.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('STATE_HISTORY.SERVICE.ERROR.CREATE_LIST'));
    });
});
