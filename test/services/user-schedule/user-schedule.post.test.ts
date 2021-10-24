// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { UserSchedule } from '../../../src/models/user-schedule.model';
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
describe('1: Probas DATOS API - UserSchedules (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userSchedules";

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
    test(`1.1: Crear UserSchedule: <${dataList.userSchedules[0].id}>`, async() => {
        const userSchedule = dataList.userSchedules[0] as UserSchedule;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userSchedule);
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
        expect(data.id).toBe(userSchedule.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userSchedule.description);

        expect(data.worksWeekends).toBeDefined();
        expect(data.worksWeekends).toBe(userSchedule.worksWeekends);

        expect(message).toBe(i18next.t('USER_SCHEDULE.SERVICE.SUCCESS.CREATE'));
    });

    test('1.2: Crear lista de UserSchedules:', async() => {
        const userSchedules = [
            new UserSchedule(dataList.userSchedules[0]),
            new UserSchedule(dataList.userSchedules[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        userSchedules[0]._id = "616c6b4c9c7900e7011c9615";
        userSchedules[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userSchedules[1]._id = "616c6b6602067b3bd0d5ffbc";
        userSchedules[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(userSchedules);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = userSchedules.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userSchedules[0].id);
        expect(data[0].id).not.toBe(userSchedules[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userSchedules[1].id);
        expect(data[1].id).not.toBe(userSchedules[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_SCHEDULE.SERVICE.SUCCESS.CREATE_LIST'));
    });
});

describe('2: Probas DATOS API - UserSchedules ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userSchedules";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userSchedules, true);
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
    test(`2.1: Crear UserSchedule con datos erróneos:`, async() => {
        const badUserSchedule = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserSchedule);
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

        expect(error).toBe(i18next.t('USER_SCHEDULE.SERVICE.ERROR.CREATE'));
    });

    test(`2.2: Crear UserSchedule: <${dataList.userSchedules[0].id}> QUE XA EXISTE`, async() => {
        const userSchedule = dataList.userSchedules[0] as UserSchedule;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userSchedule);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('USER_SCHEDULE.NAME'), id: userSchedule.id }));
    });

    test('2.3: Crear lista de UserSchedules algúns con datos erróneos:', async() => {
        const badUserSchedules = [
            new UserSchedule(dataList.userSchedules[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserSchedules[0]._id = "616c6b4c9c7900e7011c9615";
        badUserSchedules[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserSchedules[1]._id = "616c6b6602067b3bd0d5ffbc";
        badUserSchedules[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badUserSchedules);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badUserSchedules.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('USER_SCHEDULE.SERVICE.ERROR.CREATE_LIST'));
    });
});