// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
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
    test(`1.1: Actualizar UserSchedule: <${dataList.userSchedules[0].id}>`, async() => {
        const userSchedule0 = dataList.userSchedules[0] as UserSchedule;
        const userSchedule1 = dataList.userSchedules[0] as UserSchedule;

        // Modificase o modelo UserSchedule (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userSchedule1.description = userSchedule1.description + FAKE_TEXT;
        userSchedule1.worksWeekends = !userSchedule1.worksWeekends;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userSchedule1);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userSchedule0.description);
        expect(data.description).toBe(userSchedule1.description);

        expect(data.worksWeekends).toBeDefined();
        expect(data.worksWeekends).not.toBe(userSchedule0.worksWeekends);
        expect(data.worksWeekends).toBe(userSchedule1.worksWeekends);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userSchedule0.id);
        expect(data.id).toBe(userSchedule1.id);

        expect(message).toBe(i18next.t('USER_SCHEDULE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar UserSchedule con datos erróneos:`, async() => {
        const userSchedule0 = dataList.userSchedules[0] as UserSchedule;

        // Modificase o modelo UserSchedule
        userSchedule0.description = userSchedule0.description + FAKE_TEXT;

        const userSchedule1 = userSchedule0 as any;
        userSchedule1.startDate = userSchedule0.description + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userSchedule1);
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

        expect(message).toBe(i18next.t('USER_SCHEDULE.SERVICE.ERROR.UPDATE'));
    });
});
