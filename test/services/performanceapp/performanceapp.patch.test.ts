// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

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
import { date2LocaleISO } from "../../../src/helpers/date.helper";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - PerformanceApps (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performanceApps";

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
        await db.inicializeData(dataList.performances);
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
    test(`1.1: Actualizar PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const performanceApp0 = dataList.performances[0] as PerformanceApp;
        const performanceApp1 = dataList.performances[0] as PerformanceApp;

        // Modificase o modelo PerformanceApp
        performanceApp1.name = performanceApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(performanceApp0, performanceApp1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(performanceApp0.name);
        expect(data.name).toBe(performanceApp1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(performanceApp0.id);
        expect(data.id).toBe(performanceApp1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(performanceApp0.description);
        expect(data.description).toBe(performanceApp1.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(performanceApp0.startDate));
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(performanceApp1.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(performanceApp0.targetFinishDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(performanceApp1.targetFinishDate));

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar PerformanceApp con datos erróneos:`, async() => {
        const performanceApp0 = dataList.performances[0] as PerformanceApp;
        const performanceApp1 = dataList.performances[0] as PerformanceApp;

        // Modificase o modelo PerformanceApp
        performanceApp1.name = performanceApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(performanceApp0, performanceApp1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.ERROR.UPDATE'));
    });
});

