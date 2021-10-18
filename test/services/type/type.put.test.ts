// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Type } from '../../../src/models/type.model';

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
describe('Probas DATOS API - Types (PUT)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.types);
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
    test(`Actualizar Type: <${dataList.types[0].id}>`, async() => {
        const type0 = dataList.types[0] as Type;
        const type1 = dataList.types[0] as Type;

        // Modificase o modelo Type (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        type1.name = type1.name + FAKE_TEXT;
        type1.description = type1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(type1);
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

        expect(message).toBe(i18next.t('TYPE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Type con datos erróneos:`, async() => {
        const type0 = dataList.types[0] as Type;

        // Modificase o modelo Type
        type0.name = type0.name + FAKE_TEXT;

        const type1 = type0 as any;
        type1.startDate = type0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(type1);
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

        expect(message).toBe(i18next.t('TYPE.SERVICE.ERROR.UPDATE'));
    });
});
