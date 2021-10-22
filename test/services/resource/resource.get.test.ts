// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Resource } from '../../../src/models/resource.model';
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
describe('1: Probas DATOS API - Resources (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "resources";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.resources, true);
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
    test('1.1: Consultar tódolos Resources:', async() => {
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
        expect(data).toHaveLength(dataList.resources.length);
        expect(data[0].id).toBe(dataList.resources[0].id);

        expect(total).toBe(dataList.resources.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`1.2: Consultar Resource: <${dataList.resources[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const resource = dataList.resources[0] as Resource;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(resource.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(resource.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(resource.description);

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`1.3: Consultar Resource inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.resources[0].id}${FAKE_TEXT}`);
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

        expect(message).toBe(i18next.t('RESOURCE.SERVICE.ERROR.GET_SINGLE'));
    });
});
