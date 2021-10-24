// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

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
describe('1: Probas DATOS API - Stages (PUT)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar Stage: <${dataList.stages[0].id}>`, async() => {
        const stage0 = new Stage(dataList.stages[0]);
        const stage1 = new Stage(dataList.stages[0]);

        // Modificase o modelo Stage (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        stage1.name = stage1.name + FAKE_TEXT;
        stage1.description = stage1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.stages[0].id}`).send(stage1);
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
});

describe('1: Probas DATOS API - Stages ERROS (PUT)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************

    test(`2.1: Actualizar Stage con datos erróneos:`, async() => {
        const stage0 = new Stage(dataList.stages[0]);

        // Modificase o modelo Stage
        stage0.name = stage0.name + FAKE_TEXT;

        const stage1 = stage0 as any;
        stage1.createdAt = stage0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${stage0.id}`).send(stage1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('STAGE.NAME'), id: stage0.id }));
    });

    test(`2.2: Actualizar Stage que non existe:`, async() => {
        const stage0 = new Stage(dataList.stages[0]);

        // Modificase o modelo Stage
        stage0.name = stage0.name + FAKE_TEXT;

        do {
            stage0.id = new ObjectId();
        } while (stage0.id == dataList.stages[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${stage0.id}`).send(stage0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_MALE', { entity: i18next.t('STAGE.NAME'), id: stage0.id }));
    });
});
