// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { Stage } from '../../../src/models/stage.model';

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
describe('1: Probas DATOS API - Stages (PATCH)', () => {
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

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.stages);
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
    test(`1.1: Actualizar Stage: <${dataList.stages[0].id}>`, async() => {
        const stage0 = dataList.stages[0] as Stage;
        const stage1 = dataList.stages[0] as Stage;

        // Modificase o modelo Stage
        stage1.name = stage1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(stage0, stage1);

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
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(stage0.name);
        expect(data.name).toBe(stage1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(stage0.id);
        expect(data.id).toBe(stage1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(stage0.description);
        expect(data.description).toBe(stage1.description);

        expect(message).toBe(i18next.t('STAGE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar Stage con datos erróneos:`, async() => {
        const stage0 = dataList.stages[0] as Stage;
        const stage1 = dataList.stages[0] as Stage;

        // Modificase o modelo Stage
        stage1.name = stage1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(stage0, stage1);

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

        expect(message).toBe(i18next.t('STAGE.SERVICE.ERROR.UPDATE'));
    });
});
