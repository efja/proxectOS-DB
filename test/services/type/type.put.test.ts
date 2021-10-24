// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { Type } from '../../../src/models/type.model';

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
describe('1: Probas DATOS API - Types (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "types";

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
        await db.inicializeData(dataList.types);
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
    test(`1.1: Actualizar Type: <${dataList.types[0].id}>`, async() => {
        const type0 = new Type(dataList.types[0]);
        const type1 = new Type(dataList.types[0]);

        // Modificase o modelo Type (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        type1.name = type1.name + FAKE_TEXT;
        type1.description = type1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.types[0].id}`).send(type1);
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
        expect(data.name).not.toBe(type0.name);
        expect(data.name).toBe(type1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(type0.description);
        expect(data.description).toBe(type1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(type0.id);
        expect(data.id).toBe(type1.id);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('TYPE.NAME'), id: dataList.projects[0].id }));
    });
});

describe('1: Probas DATOS API - Types ERROS (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "types";

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
        await db.inicializeData(dataList.types);
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

    test(`2.1: Actualizar Type con datos erróneos:`, async() => {
        const type0 = new Type(dataList.types[0]);

        // Modificase o modelo Type
        type0.name = type0.name + FAKE_TEXT;

        const type1 = type0 as any;
        type1.createdAt = type0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${type0.id}`).send(type1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('TYPE.NAME'), id: type0.id }));
    });

    test(`2.2: Actualizar Type que non existe:`, async() => {
        const type0 = new Type(dataList.types[0]);

        // Modificase o modelo Type
        type0.name = type0.name + FAKE_TEXT;

        do {
            type0.id = new ObjectId();
        } while (type0.id == dataList.types[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${type0.id}`).send(type0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('TYPE.NAME'), id: type0.id }));
    });
});
