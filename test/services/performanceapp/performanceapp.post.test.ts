// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { PerformanceApp } from '../../../src/models/performanceapp.model';
import { User } from "../../../src/models/user.model";

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - PerformanceApps (POST)', () => {
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
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Crear PerformanceApp: <${dataList.performances[0].id}>`, async() => {
        const performanceApp = dataList.performances[0] as PerformanceApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(performanceApp);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

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
        expect(data.startDate).toBe(performanceApp.startDate);
        expect(data.targetFinishDate).toBe(performanceApp.targetFinishDate);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear PerformanceApp con datos erróneos:`, async() => {
        const badPerformanceApp = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badPerformanceApp);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de PerformanceApps:', async() => {
        const performanceApps = [
            dataList.performances[0] as PerformanceApp,
            dataList.performances[0] as PerformanceApp,
        ];

        // Se cambian los identificadores para evitar conflictos
        performanceApps[0]._id = "616c6b4c9c7900e7011c9615";
        performanceApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        performanceApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        performanceApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(performanceApps);
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

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(performanceApps.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(performanceApps[0]);
        expect(data[0].id).not.toBe(performanceApps[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(performanceApps[1]);
        expect(data[1].id).not.toBe(performanceApps[0]);

        expect(total).toBe(dataList.performances.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de PerformanceApps algúns con datos erróneos:', async() => {
        const badPerformanceApps = [
            dataList.performances[0] as PerformanceApp,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badPerformanceApps[0]._id = "616c6b4c9c7900e7011c9615";
        badPerformanceApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badPerformanceApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        badPerformanceApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badPerformanceApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badPerformanceApps.length);

        expect(total).not.toBe(badPerformanceApps.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PERFORMANCE.SERVICE.ERROR.CREATE_LIST'));
    });
});
