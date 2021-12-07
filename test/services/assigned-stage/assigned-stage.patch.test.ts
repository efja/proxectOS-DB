// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { AssignedStage } from '../../../src/models/assigned-stage.model';

import {
    app,
    runApp,
    changeDate,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - AssignedStages (PATCH)', () => {
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
        await db.inicializeData(dataList.assignedStages);
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
    test(`1.1: Actualizar AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const assignedStage0 = new AssignedStage(dataList.assignedStages[0]);
        const assignedStage1 = new AssignedStage(dataList.assignedStages[0]);

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage1.startDate);

        // Modificase o modelo AssignedStage
        assignedStage1.startDate = newStartDate;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedStage0, assignedStage1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${assignedStage0.id}`).send(objPatch);
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
        expect(data.startDate).toBeDefined();
        expect(date2LocaleISO(data.startDate)).not.toBe(date2LocaleISO(assignedStage0.startDate));
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(newStartDate));

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedStage0.id);
        expect(data.id).toBe(assignedStage1.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage0.targetFinishDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(assignedStage1.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: assignedStage1.id }));
    });

});

describe('2: Probas DATOS API - AssignedStages ERROS (PATCH)', () => {
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
        await db.inicializeData(dataList.assignedStages);
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
    test(`2.1: Actualizar AssignedStage con datos erróneos:`, async() => {
        const assignedStage0 = new AssignedStage(dataList.assignedStages[0]);
        const assignedStage1 = new AssignedStage(dataList.assignedStages[0]);

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage1.startDate);

        // Modificase o modelo AssignedStage
        assignedStage1.startDate = newStartDate;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedStage0, assignedStage1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${assignedStage0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: assignedStage0.id }));
    });

    test(`2.2: Actualizar AssignedStage que non existe:`, async() => {
        const assignedStage0 = new AssignedStage(dataList.assignedStages[0]);

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage0.startDate);

        // Modificase o modelo AssignedStage
        assignedStage0.startDate = newStartDate;

        do {
            assignedStage0._id = new ObjectId();
        } while (assignedStage0._id == dataList.assignedStages[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedStage0.id}`).send(assignedStage0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_STAGE.NAME'), id: assignedStage0.id }));
    });
});
