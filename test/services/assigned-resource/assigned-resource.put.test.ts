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
describe('Probas DATOS API - AssignedResources (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedResources";

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
        await db.inicializeData(dataList.assignedResources);
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
    test(`Actualizar AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const assignedResource0 = dataList.assignedResources[0] as AssignedResource;
        const assignedResource1 = dataList.assignedResources[0] as AssignedResource;

        // Modificase o modelo AssignedResource (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        assignedResource1.description = assignedResource1.description + FAKE_TEXT;
        assignedResource1.unitCost = assignedResource1.unitCost + 10;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(assignedResource1);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(assignedResource0.description);
        expect(data.description).toBe(assignedResource1.description);

        expect(data.unitCost).toBeDefined();
        expect(data.unitCost).not.toBe(assignedResource0.unitCost);
        expect(data.unitCost).toBe(assignedResource1.unitCost);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedResource0.id);
        expect(data.id).toBe(assignedResource1.id);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(assignedResource0.amount);
        expect(data.startDate).toBe(assignedResource1.amount);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar AssignedResource con datos erróneos:`, async() => {
        const assignedResource0 = dataList.assignedResources[0] as AssignedResource;

        // Modificase o modelo AssignedResource
        assignedResource0.description = assignedResource0.description + FAKE_TEXT;

        const assignedResource1 = assignedResource0 as any;
        assignedResource1.unitCost = assignedResource0.description + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(assignedResource1);
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

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.UPDATE'));
    });
});
