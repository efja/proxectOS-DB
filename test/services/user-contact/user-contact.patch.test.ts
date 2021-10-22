// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { UserContact } from '../../../src/models/user-contact.model';

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
describe('1: Probas DATOS API - UserContacts (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userContacts";

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
        await db.inicializeData(dataList.userContacts);
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
    test(`1.1: Actualizar UserContact: <${dataList.userContacts[0].id}>`, async() => {
        const userContact0 = dataList.userContacts[0] as UserContact;
        const userContact1 = dataList.userContacts[0] as UserContact;

        // Modificase o modelo UserContact
        userContact1.contact = userContact1.contact + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userContact0, userContact1);

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
        expect(data.contact).toBeDefined();
        expect(data.contact).not.toBe(userContact0.contact);
        expect(data.contact).toBe(userContact1.contact);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContact0.id);
        expect(data.id).toBe(userContact1.id);

        expect(data.type.id).toBeDefined();
        expect(data.type.id).toBe(userContact0.type.id);
        expect(data.type.id).toBe(userContact1.type.id);

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar UserContact con datos erróneos:`, async() => {
        const userContact0 = dataList.userContacts[0] as UserContact;
        const userContact1 = dataList.userContacts[0] as UserContact;

        // Modificase o modelo UserContact
        userContact1.contact = userContact1.contact + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userContact0, userContact1);

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

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.ERROR.UPDATE'));
    });
});
