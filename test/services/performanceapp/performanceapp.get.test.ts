// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { PerformanceApp } from '../../../src/models/performanceapp.model';
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
describe('Probas DATOS API - PerformanceApps (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performanceApps";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.performances, true);
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
    test('Tódolos PerformanceApps:', async() => {
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
        expect(data).toHaveLength(dataList.performances.length);
        expect(data[0].id).toBe(dataList.performances[0].id);

        expect(total).toBe(dataList.performances.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.performances[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const performanceApp = dataList.performances[0] as PerformanceApp;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(performanceApp.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(performanceApp.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(performanceApp.description);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(performanceApp.startDate);
        expect(data.targetFinishDate).toBe(performanceApp.targetFinishDate);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`PerformanceApp inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.performances[0].id}${FAKE_TEXT}`);
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

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.ERROR.GET_SINGLE'));
    });
});
