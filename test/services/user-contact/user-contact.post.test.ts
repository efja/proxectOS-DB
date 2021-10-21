// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { User } from "../../../src/models/user.model";
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
describe('Probas DATOS API - UserContacts (POST)', () => {
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
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Crear UserContact: <${dataList.userContacts[0].id}>`, async() => {
        const userContact = dataList.userContacts[0] as UserContact;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userContact);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContact.id);

        expect(data.contact).toBeDefined();
        expect(data.contact).toBe(userContact.contact);

        expect(data.type.id).toBeDefined();
        expect(data.type.id).toBe(userContact.type.id);

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear UserContact con datos erróneos:`, async() => {
        const badUserContact = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badUserContact);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de UserContacts:', async() => {
        const userContacts = [
            dataList.userContacts[0] as UserContact,
            dataList.userContacts[0] as UserContact,
        ];

        // Se cambian los identificadores para evitar conflictos
        userContacts[0]._id = "616c6b4c9c7900e7011c9615";
        userContacts[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userContacts[1]._id = "616c6b6602067b3bd0d5ffbc";
        userContacts[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(userContacts);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(userContacts.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userContacts[0]);
        expect(data[0].id).not.toBe(userContacts[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userContacts[1]);
        expect(data[1].id).not.toBe(userContacts[0]);

        expect(total).toBe(dataList.userContacts.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de UserContacts algúns con datos erróneos:', async() => {
        const badUserContacts = [
            dataList.userContacts[0] as UserContact,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserContacts[0]._id = "616c6b4c9c7900e7011c9615";
        badUserContacts[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserContacts[1]._id = "616c6b6602067b3bd0d5ffbc";
        badUserContacts[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserContacts);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badUserContacts.length);

        expect(total).not.toBe(badUserContacts.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_CONTACT.SERVICE.ERROR.CREATE_LIST'));
    });
});
