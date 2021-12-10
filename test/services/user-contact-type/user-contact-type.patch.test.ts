// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import ooPatch from 'json8-patch';
import { ObjectId } from "@mikro-orm/mongodb";

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

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const userContactType0 = new UserContactType(dataList.userContactTypes[0]);
        const userContactType1 = new UserContactType(dataList.userContactTypes[0]);

        // Modificase o modelo UserContactType
        userContactType1.description = userContactType1.description + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = ooPatch.diff(userContactType0, userContactType1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${userContactType0.id}`).send(objPatch);
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
        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userContactType0.description);
        expect(data.description).toBe(userContactType1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContactType0.id);
        expect(data.id).toBe(userContactType1.id);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType1.id }));
    });

});

describe('2: Probas DATOS API - UserContactTypes ERROS (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Actualizar UserContactType con datos erróneos:`, async() => {
        const userContactType0 = new UserContactType(dataList.userContactTypes[0]);
        const userContactType1 = new UserContactType(dataList.userContactTypes[0]);

        // Modificase o modelo UserContactType
        userContactType1.description = userContactType1.description + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = ooPatch.diff(userContactType0, userContactType1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${userContactType0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType0.id }));
    });

    test(`2.2: Actualizar UserContactType que non existe:`, async() => {
        const userContactType0 = new UserContactType(dataList.userContactTypes[0]);

        // Modificase o modelo UserContactType
        userContactType0.description = userContactType0.description + FAKE_TEXT;

        do {
            userContactType0._id = new ObjectId();
        } while (userContactType0._id == dataList.userContactTypes[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userContactType0.id}`).send(userContactType0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType0.id }));
    });
});
