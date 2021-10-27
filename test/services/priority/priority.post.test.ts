// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Priority } from '../../../src/models/priority.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";
import { CommentApp } from "../../../src/models/commentapp.model";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - Priorities (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "priorities";

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
    test(`1.1: Crear Priority: <${dataList.priorities[0].id}>`, async() => {
        const priority = dataList.priorities[0] as Priority;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(priority);
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
        expect(data.id).toBe(priority.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(priority.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(priority.description);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('PRIORITY.NAME') }));
    });

    test('1.2: Crear lista de Priorities:', async() => {
        const priorities = [
            new Priority(dataList.priorities[0]),
            new Priority(dataList.priorities[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        priorities[0]._id = "616c6b4c9c7900e7011c9615";
        priorities[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        priorities[1]._id = "616c6b6602067b3bd0d5ffbc";
        priorities[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(priorities);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = priorities.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(priorities[0].id);
        expect(data[0].id).not.toBe(priorities[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(priorities[1].id);
        expect(data[1].id).not.toBe(priorities[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('PRIORITY.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - Priorities ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "priorities";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.priorities, true);
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
    test(`2.1: Crear Priority con datos erróneos:`, async() => {
        const badPriority = dataList.comments[0] as CommentApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badPriority);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('PRIORITY.NAME') }));
    });

    test(`2.2: Crear Priority: <${dataList.priorities[0].id}> QUE XA EXISTE`, async() => {
        const priority = dataList.priorities[0] as Priority;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(priority);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('PRIORITY.NAME'), id: priority.id }));
    });

    test('2.3: Crear lista de Priorities algúns con datos erróneos:', async() => {
        const badPriorities = [
            new Priority(dataList.priorities[0]),
            new CommentApp(dataList.comments[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badPriorities[0]._id = "616c6b4c9c7900e7011c9615";
        badPriorities[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badPriorities[1]._id = "616c6b6602067b3bd0d5ffbc";
        badPriorities[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badPriorities);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.priorities.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('PRIORITY.NAME_PLURAL') }));
    });
});