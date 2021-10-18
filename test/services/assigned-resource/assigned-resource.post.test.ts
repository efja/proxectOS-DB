// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { User } from "../../../src/models/user.model";
import { AssignedResource } from '../../../src/models/assigned-resource.model';

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - AssignedResources (POST)', () => {
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
    test(`Crear AssignedResource: <${dataList.assignedResources[0].id}>`, async() => {
        const assignedResource = dataList.assignedResources[0] as AssignedResource;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedResource);
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
        expect(data.id).toBe(assignedResource.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(assignedResource.description);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(assignedResource.amount);
        expect(data.targetFinishDate).toBe(assignedResource.amount);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear AssignedResource con datos erróneos:`, async() => {
        const badAssignedResource = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badAssignedResource);
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

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de AssignedResources:', async() => {
        const assignedResources = [
            dataList.assignedResources[0] as AssignedResource,
            dataList.assignedResources[0] as AssignedResource,
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedResources[0]._id = "616c6b4c9c7900e7011c9615";
        assignedResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(assignedResources);
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
        expect(data).toHaveLength(assignedResources.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedResources[0]);
        expect(data[0].id).not.toBe(assignedResources[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedResources[1]);
        expect(data[1].id).not.toBe(assignedResources[0]);

        expect(total).toBe(dataList.assignedResources.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de AssignedResources algúns con datos erróneos:', async() => {
        const badAssignedResources = [
            dataList.assignedResources[0] as AssignedResource,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedResources[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedResources[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedResources[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedResources[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedResources);
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
        expect(data).not.toHaveLength(badAssignedResources.length);

        expect(total).not.toBe(badAssignedResources.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_RESOURCE.SERVICE.ERROR.CREATE_LIST'));
    });
});
