// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { AssignedStage } from '../../../src/models/assigned-stage.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";
import { date2LocaleISO } from "../../../src/helpers/date.helper";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - AssignedStages (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedStages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedStages, true);
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
    test('1.1: Consultar tódolos AssignedStages:', async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}`);
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

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataList.assignedStages.length);
        expect(data[0].id).toBe(dataList.assignedStages[0].id);

        expect(total).toBe(dataList.assignedStages.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`1.2: Consultar AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedStage.id);

        expect(data.stage).toBeDefined();
        expect(data.stage.id).toBe(assignedStage.stage.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(assignedStage.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage.targetFinishDate));

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`1.3: Consultar AssignedStage inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedStages[0].id}${FAKE_TEXT}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.ERROR.GET_SINGLE'));
    });
});
