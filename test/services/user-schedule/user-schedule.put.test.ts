// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { UserSchedule } from '../../../src/models/user-schedule.model';

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
describe('1: Probas DATOS API - UserSchedules (PUT)', () => {
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
        await db.inicializeData(dataList.userSchedules);
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
    test(`1.1: Actualizar UserSchedule: <${dataList.userSchedules[0].id}>`, async() => {
        const userSchedule0 = new UserSchedule(dataList.userSchedules[0]);
        const userSchedule1 = new UserSchedule(dataList.userSchedules[0]);

        // Modificase o modelo UserSchedule (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userSchedule1.description = userSchedule1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.userSchedules[0].id}`).send(userSchedule1);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userSchedule0.description);
        expect(data.description).toBe(userSchedule1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userSchedule0.id);
        expect(data.id).toBe(userSchedule1.id);

        expect(data.worksWeekends).toBeDefined();
        expect(data.worksWeekends).toBe(userSchedule0.worksWeekends);
        expect(data.worksWeekends).toBe(userSchedule1.worksWeekends);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('USER_SCHEDULE.NAME'), id: userSchedule1.id }));
    });
});

describe('1: Probas DATOS API - UserSchedules ERROS (PUT)', () => {
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
        await db.inicializeData(dataList.userSchedules);
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

    test(`2.1: Actualizar UserSchedule con datos erróneos:`, async() => {
        const userSchedule0 = new UserSchedule(dataList.userSchedules[0]);

        // Modificase o modelo UserSchedule
        userSchedule0.description = userSchedule0.description + FAKE_TEXT;

        const userSchedule1 = userSchedule0 as any;
        userSchedule1.createdAt = userSchedule0.description + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userSchedule0.id}`).send(userSchedule1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('USER_SCHEDULE.NAME'), id: userSchedule0.id }));
    });

    test(`2.2: Actualizar UserSchedule que non existe:`, async() => {
        const userSchedule0 = new UserSchedule(dataList.userSchedules[0]);

        // Modificase o modelo UserSchedule
        userSchedule0.description = userSchedule0.description + FAKE_TEXT;

        do {
            userSchedule0._id = new ObjectId();
        } while (userSchedule0._id == dataList.userSchedules[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userSchedule0.id}`).send(userSchedule0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_SCHEDULE.NAME'), id: userSchedule0.id }));
    });
});
