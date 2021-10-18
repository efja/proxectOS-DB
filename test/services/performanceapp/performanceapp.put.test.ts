// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { PerformanceApp } from '../../../src/models/performanceapp.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - PerformanceApps (PUT)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.performances);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Actualizar PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const performanceApp0 = dataList.performances[0] as PerformanceApp;
        const performanceApp1 = dataList.performances[0] as PerformanceApp;

        // Modificase o modelo PerformanceApp (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        performanceApp1.name = performanceApp1.name + FAKE_TEXT;
        performanceApp1.description = performanceApp1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(performanceApp1);
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

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(performanceApp0.description);
        expect(data.description).toBe(performanceApp1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(performanceApp0.id);
        expect(data.id).toBe(performanceApp1.id);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(performanceApp0.startDate);
        expect(data.startDate).toBe(performanceApp1.startDate);
        expect(data.targetFinishDate).toBe(performanceApp0.targetFinishDate);
        expect(data.targetFinishDate).toBe(performanceApp1.targetFinishDate);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar PerformanceApp con datos erróneos:`, async() => {
        const performanceApp0 = dataList.performances[0] as PerformanceApp;

        // Modificase o modelo PerformanceApp
        performanceApp0.name = performanceApp0.name + FAKE_TEXT;

        const performanceApp1 = performanceApp0 as any;
        performanceApp1.startDate = performanceApp0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(performanceApp1);
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
