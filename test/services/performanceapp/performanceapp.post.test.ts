// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { PerformanceApp } from '../../../src/models/performanceapp.model';
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
describe('1: Probas DATOS API - PerformanceApps (POST)', () => {
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
    test(`1.1: Crear PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const performanceApp = dataList.performances[0] as PerformanceApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(performanceApp);
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
        expect(data.id).toBe(performanceApp.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(performanceApp.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(performanceApp.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(performanceApp.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(performanceApp.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('PERFORMANCE.NAME') }));
    });

    test('1.2: Crear lista de PerformanceApps:', async() => {
        const performanceApps = [
            new PerformanceApp(dataList.performances[0]),
            new PerformanceApp(dataList.performances[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        performanceApps[0]._id = "616c6b4c9c7900e7011c9615";
        performanceApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        performanceApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        performanceApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(performanceApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = performanceApps.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(performanceApps[0].id);
        expect(data[0].id).not.toBe(performanceApps[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(performanceApps[1].id);
        expect(data[1].id).not.toBe(performanceApps[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('PERFORMANCE.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - PerformanceApps ERROS (POST)', () => {
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
    test(`2.1: Crear PerformanceApp con datos erróneos:`, async() => {
        const badPerformanceApp = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badPerformanceApp);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('PERFORMANCE.NAME') }));
    });

    test(`2.2: Crear PerformanceApp: <${dataList.performances[0].id}> QUE XA EXISTE`, async() => {
        const performanceApp = dataList.performances[0] as PerformanceApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(performanceApp);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('PERFORMANCE.NAME'), id: performanceApp.id }));
    });

    test('2.3: Crear lista de PerformanceApps algúns con datos erróneos:', async() => {
        const badPerformanceApps = [
            new PerformanceApp(dataList.performances[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badPerformanceApps[0]._id = "616c6b4c9c7900e7011c9615";
        badPerformanceApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badPerformanceApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        badPerformanceApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badPerformanceApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badPerformanceApps.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('PERFORMANCE.NAME_PLURAL') }));
    });
});