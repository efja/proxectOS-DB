// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { AssignedStage } from '../../../src/models/assigned-stage.model';
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
describe('1: Probas DATOS API - AssignedStages (POST)', () => {
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
    test(`1.1: Crear AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedStage);
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
        expect(data.id).toBe(assignedStage.id);

        expect(data.startDate).toBeDefined();
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(assignedStage.startDate));

        expect(date2LocaleISO(data.finishDate)).toBeDefined();
        expect(date2LocaleISO(data.finishDate)).toBe(date2LocaleISO(assignedStage.finishDate));

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(assignedStage.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('ASSIGNED_STAGE.NAME') }));
    });

    test('1.2: Crear lista de AssignedStages:', async() => {
        const assignedStages = [
            new AssignedStage(dataList.assignedStages[0]),
            new AssignedStage(dataList.assignedStages[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedStages[0]._id = "616c6b4c9c7900e7011c9615";
        assignedStages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedStages[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedStages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(assignedStages);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = assignedStages.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedStages[0].id);
        expect(data[0].id).not.toBe(assignedStages[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedStages[1].id);
        expect(data[1].id).not.toBe(assignedStages[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('ASSIGNED_STAGE.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - AssignedStages ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedStages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedStages, true);
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
    test(`2.1: Crear AssignedStage con datos erróneos:`, async() => {
        const badAssignedStage = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedStage);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('ASSIGNED_STAGE.NAME') }));
    });

    test(`2.2: Crear AssignedStage: <${dataList.assignedStages[0].id}> QUE XA EXISTE`, async() => {
        const assignedStage = dataList.assignedStages[0] as AssignedStage;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedStage);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: assignedStage.id }));
    });

    test('2.3: Crear lista de AssignedStages algúns con datos erróneos:', async() => {
        const badAssignedStages = [
            new AssignedStage(dataList.assignedStages[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedStages[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedStages[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedStages[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedStages[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badAssignedStages);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badAssignedStages.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('ASSIGNED_STAGE.NAME_PLURAL') }));
    });
});