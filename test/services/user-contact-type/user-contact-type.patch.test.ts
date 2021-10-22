// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { UserContactType } from '../../../src/models/user-contact-type.model';

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
describe('1: Probas DATOS API - UserContactTypes (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userContactTypes";

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
        await db.inicializeData(dataList.userContactTypes);
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
    test(`1.1: Actualizar UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const userContactType0 = dataList.userContactTypes[0] as UserContactType;
        const userContactType1 = dataList.userContactTypes[0] as UserContactType;

        // Modificase o modelo UserContactType
        userContactType1.description = userContactType1.description + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userContactType0, userContactType1);

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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userContactType0.description);
        expect(data.description).toBe(userContactType1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContactType0.id);
        expect(data.id).toBe(userContactType1.id);

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar UserContactType con datos erróneos:`, async() => {
        const userContactType0 = dataList.userContactTypes[0] as UserContactType;
        const userContactType1 = dataList.userContactTypes[0] as UserContactType;

        // Modificase o modelo UserContactType
        userContactType1.description = userContactType1.description + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userContactType0, userContactType1);

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

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.ERROR.UPDATE'));
    });
});
