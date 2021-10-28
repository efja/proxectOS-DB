// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { UserContact } from '../../../src/models/user-contact.model';
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
describe('1: Probas DATOS API - UserContacts (PUT)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar UserContact: <${dataList.userContacts[0].id}>`, async() => {
        const userContact0 = new UserContact(dataList.userContacts[0]);
        const userContact1 = new UserContact(dataList.userContacts[0]);

        const userContact0TypeId = userContact0.type.id;

        // Modificase o modelo UserContact (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userContact1.contact = userContact1.contact + FAKE_TEXT;

        // Modificase o modelo AssignedUser (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userContact1.type = dataList.users[0]._id != userContact1.type._id
            ? (dataList.types[0] as UserContactType)._id
            : (dataList.types[1] as UserContactType)._id;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.userContacts[0].id}`).send(userContact1);
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
        expect(data.contact).toBeDefined();
        expect(data.contact).not.toBe(userContact0.contact);
        expect(data.contact).toBe(userContact1.contact);

        expect(data.type).toBeDefined();
        expect(data.type).not.toBe(userContact0TypeId);
        expect(data.type).toBe(userContact1.type);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContact0.id);
        expect(data.id).toBe(userContact1.id);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('USER_CONTACT.NAME'), id: userContact1.id }));
    });
});

describe('1: Probas DATOS API - UserContacts ERROS (PUT)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************

    test(`2.1: Actualizar UserContact con datos erróneos:`, async() => {
        const userContact0 = new UserContact(dataList.userContacts[0]);

        // Modificase o modelo UserContact
        userContact0.contact = userContact0.contact + FAKE_TEXT;

        const userContact1 = userContact0 as any;
        userContact1.createdAt = FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userContact0.id}`).send(userContact1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('USER_CONTACT.NAME'), id: userContact0.id }));
    });

    test(`2.2: Actualizar UserContact que non existe:`, async() => {
        const userContact0 = new UserContact(dataList.userContacts[0]);

        // Modificase o modelo UserContact
        userContact0.contact = userContact0.contact + FAKE_TEXT;

        do {
            userContact0.id = new ObjectId();
        } while (userContact0.id == dataList.userContacts[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userContact0.id}`).send(userContact0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_CONTACT.NAME'), id: userContact0.id }));
    });
});
