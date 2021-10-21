// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Users (PUT)', () => {
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
    test(`Actualizar User: <${dataList.users[0].id}>`, async() => {
        const user0 = dataList.users[0] as User;
        const user1 = dataList.users[0] as User;

        // Modificase o modelo User (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        user1.name = user1.name + FAKE_TEXT;
        user1.secondSurname = user1.secondSurname + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(user1);
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

        expect(message).toBe(i18next.t('USER.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar User con datos erróneos:`, async() => {
        const user0 = dataList.users[0] as User;

        // Modificase o modelo User
        user0.name = user0.name + FAKE_TEXT;

        const user1 = user0 as any;
        user1.startDate = user0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(user1);
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

        expect(message).toBe(i18next.t('USER.SERVICE.ERROR.UPDATE'));
    });
});
