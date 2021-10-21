// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { AssignedStage } from '../../../src/models/assigned-stage.model';
import { User } from "../../../src/models/user.model";

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
describe('Probas DATOS API - AssignedStages (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedStages";

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
    test(`Crear AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedStage);
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
        expect(data.id).toBe(assignedStage.id);

        expect(data.startDate).toBeDefined();
        expect(data.startDate).toBe(assignedStage.startDate);

        expect(data.finishDate).toBeDefined();
        expect(data.finishDate).toBe(assignedStage.finishDate);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(assignedStage.startDate);
        expect(data.targetFinishDate).toBe(assignedStage.targetFinishDate);

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear AssignedStage con datos erróneos:`, async() => {
        const badAssignedStage = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badAssignedStage);
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

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de AssignedStages:', async() => {
        const assignedStages = [
            dataList.assignedStages[0] as AssignedStage,
            dataList.assignedStages[0] as AssignedStage,
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedStages[0]._id = "616c6b4c9c7900e7011c9615";
        assignedStages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedStages[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedStages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(assignedStages);
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
        expect(data).toHaveLength(assignedStages.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedStages[0]);
        expect(data[0].id).not.toBe(assignedStages[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedStages[1]);
        expect(data[1].id).not.toBe(assignedStages[0]);

        expect(total).toBe(dataList.assignedStages.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de AssignedStages algúns con datos erróneos:', async() => {
        const badAssignedStages = [
            dataList.assignedStages[0] as AssignedStage,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedStages[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedStages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedStages[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedStages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedStages);
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
        expect(data).not.toHaveLength(badAssignedStages.length);

        expect(total).not.toBe(badAssignedStages.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.ERROR.CREATE_LIST'));
    });
});
