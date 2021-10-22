// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { UserGroup } from '../../../src/models/user-group.model';

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
describe('1: Probas DATOS API - UserGroups (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userGroups";

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
        await db.inicializeData(dataList.userGroups);
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
    test(`1.1: Actualizar UserGroup: <${dataList.userGroups[0].id}>`, async() => {
        const userGroup0 = dataList.userGroups[0] as UserGroup;
        const userGroup1 = dataList.userGroups[0] as UserGroup;

        // Modificase o modelo UserGroup (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        userGroup1.name = userGroup1.name + FAKE_TEXT;
        userGroup1.description = userGroup1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userGroup1);
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
        expect(data.name).not.toBe(userGroup0.name);
        expect(data.name).toBe(userGroup1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(userGroup0.description);
        expect(data.description).toBe(userGroup1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userGroup0.id);
        expect(data.id).toBe(userGroup1.id);

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar UserGroup con datos erróneos:`, async() => {
        const userGroup0 = dataList.userGroups[0] as UserGroup;

        // Modificase o modelo UserGroup
        userGroup0.name = userGroup0.name + FAKE_TEXT;

        const userGroup1 = userGroup0 as any;
        userGroup1.startDate = userGroup0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(userGroup1);
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

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.ERROR.UPDATE'));
    });
});
