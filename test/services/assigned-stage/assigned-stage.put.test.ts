// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { AssignedStage } from '../../../src/models/assigned-stage.model';

import {
    API_BASE,
    changeDate,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - AssignedStages (PUT)', () => {
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
    test(`Actualizar AssignedStage: <${dataList.assignedStages[0].id}>`, async() => {
        const assignedStage0 = dataList.assignedStages[0] as AssignedStage;
        const assignedStage1 = dataList.assignedStages[0] as AssignedStage;

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage1.startDate);
        const newFinishDate = changeDate(assignedStage1.finishDate);

        // Modificase o modelo AssignedStage (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        assignedStage1.startDate = newStartDate;
        assignedStage1.finishDate = newFinishDate;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(assignedStage1);
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
        expect(data.startDate).not.toBe(assignedStage0.startDate);
        expect(data.startDate).toBe(newStartDate);

        expect(data.finishDate).toBeDefined();
        expect(data.finishDate).not.toBe(assignedStage0.finishDate);
        expect(data.finishDate).toBe(newFinishDate);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedStage0.id);
        expect(data.id).toBe(assignedStage1.id);

        expect(message).toBe(i18next.t('ASSIGNED_STAGE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar AssignedStage con datos erróneos:`, async() => {
        const assignedStage0 = dataList.assignedStages[0] as AssignedStage;

        // Cambiamos a data de inicio
        const newStartDate = changeDate(assignedStage0.startDate);

        // Modificase o modelo AssignedStage
        assignedStage0.startDate = newStartDate;

        const assignedStage1 = assignedStage0 as any;
        assignedStage1.startDate = assignedStage0.startDate + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(assignedStage1);
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
