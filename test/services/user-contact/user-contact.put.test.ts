// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { UserContact } from '../../../src/models/user-contact.model';

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
describe('Probas DATOS API - UserContacts (PUT)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userContacts);
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
    test(`Actualizar UserContact: <${dataList.userContacts[0].id}>`, async() => {
        const userContact0 = dataList.userContacts[0] as UserContact;
        const userContact1 = dataList.userContacts[0] as UserContact;

        // Modificase o modelo UserContact (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userContact1.contact = userContact1.contact + FAKE_TEXT;
        userContact1.type.id = userContact1.type.id + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userContact1);
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

        expect(data.type.id).toBeDefined();
        expect(data.type.id).not.toBe(userContact0.type.id);
        expect(data.type.id).toBe(userContact1.type.id);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContact0.id);
        expect(data.id).toBe(userContact1.id);

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar UserContact con datos erróneos:`, async() => {
        const userContact0 = dataList.userContacts[0] as UserContact;

        // Modificase o modelo UserContact
        userContact0.contact = userContact0.contact + FAKE_TEXT;

        const userContact1 = userContact0 as any;
        userContact1.startDate = userContact0.contact + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userContact1);
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
