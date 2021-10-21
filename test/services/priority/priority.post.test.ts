// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Priority } from '../../../src/models/priority.model';
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
describe('Probas DATOS API - Prioritys (POST)', () => {
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
    test(`Crear Priority: <${dataList.priorities[0].id}>`, async() => {
        const priority = dataList.priorities[0] as Priority;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(priority);
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
        expect(data.id).toBe(priority.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(priority.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(priority.description);

        expect(message).toBe(i18next.t('PRIORITY.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear Priority con datos erróneos:`, async() => {
        const badPriority = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badPriority);
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

        expect(message).toBe(i18next.t('PRIORITY.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de Prioritys:', async() => {
        const priorities = [
            dataList.priorities[0] as Priority,
            dataList.priorities[0] as Priority,
        ];

        // Se cambian los identificadores para evitar conflictos
        priorities[0]._id = "616c6b4c9c7900e7011c9615";
        priorities[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        priorities[1]._id = "616c6b6602067b3bd0d5ffbc";
        priorities[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(priorities);
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
        expect(data).toHaveLength(priorities.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(priorities[0]);
        expect(data[0].id).not.toBe(priorities[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(priorities[1]);
        expect(data[1].id).not.toBe(priorities[0]);

        expect(total).toBe(dataList.priorities.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PRIORITY.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de Prioritys algúns con datos erróneos:', async() => {
        const badPrioritys = [
            dataList.priorities[0] as Priority,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badPrioritys[0]._id = "616c6b4c9c7900e7011c9615";
        badPrioritys[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badPrioritys[1]._id = "616c6b6602067b3bd0d5ffbc";
        badPrioritys[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badPrioritys);
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
        expect(data).not.toHaveLength(badPrioritys.length);

        expect(total).not.toBe(badPrioritys.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PRIORITY.SERVICE.ERROR.CREATE_LIST'));
    });
});
