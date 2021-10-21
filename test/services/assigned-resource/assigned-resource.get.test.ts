// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { AssignedResource } from '../../../src/models/assigned-resource.model';

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
describe('Probas DATOS API - Projects (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedResources";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedResources, true);
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
    test('Tódolos AssignedResources:', async() => {
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
        expect(data).toHaveLength(dataList.assignedResources.length);
        expect(data[0].id).toBe(dataList.assignedResources[0].id);

        expect(total).toBe(dataList.assignedResources.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedResource.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(assignedResource.description);

        expect(data.amount).toBeDefined();
        expect(data.amount).toBe(assignedResource.amount);

        expect(data.resource).toBeDefined();
        expect(data.resource.id).toBe(assignedResource.resource.id);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`AssignedResource inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.assignedResources[0].id}${FAKE_TEXT}`);
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

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.GET_SINGLE'));
    });
});
