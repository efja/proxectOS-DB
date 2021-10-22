// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { AssignedStage } from '../../../src/models/assigned-stage.model';

import {
    API_BASE,
    changeDate,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";
import { date2LocaleISO } from "../../../src/helpers/date.helper";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedStages);
	});

	afterEach(async () => {
		await db.dropAllData(dataList.allModels);
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const assignedStage0 = dataList.assignedStages[0] as AssignedStage;
        const assignedStage1 = dataList.assignedStages[0] as AssignedStage

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage1.startDate);

        // Modificase o modelo AssignedStage
        assignedStage1.startDate = newStartDate;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedStage0, assignedStage1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar AssignedStage con datos erróneos:`, async() => {
        const assignedStage0 = dataList.assignedStages[0] as AssignedStage;
        const assignedStage1 = dataList.assignedStages[0] as AssignedStage;

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage1.startDate);

        // Modificase o modelo AssignedStage
        assignedStage1.startDate = newStartDate;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedStage0, assignedStage1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/`).send(objPatch);
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

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.ERROR.UPDATE'));
    });
});
