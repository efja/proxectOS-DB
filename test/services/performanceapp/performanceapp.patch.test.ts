// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

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
describe('1: Probas DATOS API - PerformanceApps (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performances";

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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const performanceApp0 = new PerformanceApp(dataList.performances[0]);
        const performanceApp1 = new PerformanceApp(dataList.performances[0]);

        // Modificase o modelo PerformanceApp
        performanceApp1.name = performanceApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(performanceApp0, performanceApp1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${performanceApp0.id}`).send(objPatch);
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

});

describe('2: Probas DATOS API - PerformanceApps ERROS (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "performances";

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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Actualizar PerformanceApp con datos erróneos:`, async() => {
        const performanceApp0 = new PerformanceApp(dataList.performances[0]);
        const performanceApp1 = new PerformanceApp(dataList.performances[0]);

        // Modificase o modelo PerformanceApp
        performanceApp1.name = performanceApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(performanceApp0, performanceApp1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${performanceApp0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('PERFORMANCE.NAME'), id: performanceApp0.id }));
    });

    test(`2.2: Actualizar PerformanceApp que non existe:`, async() => {
        const performanceApp0 = new PerformanceApp(dataList.performances[0]);

        // Modificase o modelo PerformanceApp
        performanceApp0.name = performanceApp0.name + FAKE_TEXT;

        do {
            performanceApp0.id = new ObjectId();
        } while (performanceApp0.id == dataList.performances[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${performanceApp0.id}`).send(performanceApp0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('PERFORMANCE.NAME'), id: performanceApp0.id }));
    });
});
