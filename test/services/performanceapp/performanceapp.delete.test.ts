// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

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
describe('1: Probas DATOS API - PerformanceApps (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performances";

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
    test(`1.1: Borrar PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.performances[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const performanceApp = dataList.performances[0] as PerformanceApp;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

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
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(performanceApp.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(performanceApp.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.DELETE', { entity: i18next.t('PERFORMANCE.NAME') }));

        // --------------------------------------------------------------------------------------------
        // -- COMPROBASE QUE A ENTIDADE XA NON EXISTE NA BD
        // --------------------------------------------------------------------------------------------
        const responseGet = await request.get(`${API_BASE}/${ENDPOINT}/${data.id}`);
        const {
            code    : codeGet,
            data    : dataGet,
            message : messageGet,
            error   : errorGet,
        } = responseGet.body

        expect(errorGet).toBeDefined();
        expect(messageGet).toBeUndefined();

        expect(responseGet.status).toBe(HttpStatus.NOT_FOUND);
        expect(codeGet).toBe(HttpStatus.NOT_FOUND);
        expect(dataGet).toBeUndefined();

        expect(errorGet).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('PERFORMANCE.NAME') }));
    });
});

describe('2: Probas DATOS API - PerformanceApps ERROS (DELETE)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performances";

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
    test(`2.1: Borrar PerformanceApp inexistente:`, async() => {
        const response = await request.delete(`${API_BASE}/${ENDPOINT}/${dataList.performances[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.DELETE', { entity: i18next.t('PERFORMANCE.NAME') }));
    });
});
