// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

import { User } from '../../../src/models/user.model';

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
describe('1: Probas DATOS API - Users (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "users";

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
        await db.inicializeData(dataList.users);
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
    test(`1.1: Actualizar User: <${dataList.users[0].id}>`, async() => {
        const user0 = new User(dataList.users[0]);
        const user1 = new User(dataList.users[0]);

        // Modificase o modelo User (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        user1.name = user1.name + FAKE_TEXT;
        user1.secondSurname = user1.secondSurname + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${user1.id}`).send(user1);
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
        expect(data.name).not.toBe(user0.name);
        expect(data.name).toBe(user1.name);

        expect(data.secondSurname).toBeDefined();
        expect(data.secondSurname).not.toBe(user0.secondSurname);
        expect(data.secondSurname).toBe(user1.secondSurname);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(user0.id);
        expect(data.id).toBe(user1.id);

        expect(data.firstSurname).toBeDefined();
        expect(data.firstSurname).toBe(user1.firstSurname);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('USER.NAME'), id: user1.id }));
    });
});

describe('2: Probas DATOS API - Users ERROS (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "users";

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
        await db.inicializeData(dataList.users);
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

    test(`2.1: Actualizar User con datos erróneos:`, async() => {
        const user0 = new User(dataList.users[0]);

        // Modificase o modelo User
        user0.name = user0.name + FAKE_TEXT;

        const user1 = user0 as any;
        user1.createdAt = user0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${user0.id}`).send(user1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('USER.NAME'), id: user0.id }));
    });

    test(`2.2: Actualizar User que non existe:`, async() => {
        const user0 = new User(dataList.users[0]);

        // Modificase o modelo User
        user0.name = user0.name + FAKE_TEXT;

        do {
            user0._id = new ObjectId();
        } while (user0._id == dataList.users[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${user0.id}`).send(user0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER.NAME'), id: user0.id }));
    });
});
