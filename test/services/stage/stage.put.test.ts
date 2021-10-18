// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Stage } from '../../../src/models/stage.model';

import {
    API_BASE,
    dataList,
    db,
    FAKE_TEXT,
    request,
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Stages (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "stages";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.stages);
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
    test(`Actualizar Stage: <${dataList.stages[0].id}>`, async() => {
        const stage0 = dataList.stages[0] as Stage;
        const stage1 = dataList.stages[0] as Stage;

        // Modificase o modelo Stage (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        stage1.name = stage1.name + FAKE_TEXT;
        stage1.description = stage1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(stage1);
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
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(stage0.name);
        expect(data.name).toBe(stage1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(stage0.description);
        expect(data.description).toBe(stage1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stage0.id);
        expect(data.id).toBe(stage1.id);

        expect(message).toBe(i18next.t('STAGE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Stage con datos erróneos:`, async() => {
        const stage0 = dataList.stages[0] as Stage;

        // Modificase o modelo Stage
        stage0.name = stage0.name + FAKE_TEXT;

        const stage1 = stage0 as any;
        stage1.startDate = stage0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(stage1);
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

        expect(message).toBe(i18next.t('STAGE.SERVICE.ERROR.UPDATE'));
    });
});
