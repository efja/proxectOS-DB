// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

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
describe('1: Probas DATOS API - UserGroups (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar UserGroup: <${dataList.userGroups[0].id}>`, async() => {
        const userGroup0 = new UserGroup(dataList.userGroups[0]);
        const userGroup1 = new UserGroup(dataList.userGroups[0]);

        // Modificase o modelo UserGroup
        userGroup1.name = userGroup1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userGroup0, userGroup1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${userGroup0.id}`).send(objPatch);
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
        expect(data.name).not.toBe(userGroup0.name);
        expect(data.name).toBe(userGroup1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userGroup0.id);
        expect(data.id).toBe(userGroup1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userGroup0.description);
        expect(data.description).toBe(userGroup1.description);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('USER_GROUP.NAME'), id: userGroup1.id }));
    });

});

describe('2: Probas DATOS API - UserGroups ERROS (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Actualizar UserGroup con datos erróneos:`, async() => {
        const userGroup0 = new UserGroup(dataList.userGroups[0]);
        const userGroup1 = new UserGroup(dataList.userGroups[0]);

        // Modificase o modelo UserGroup
        userGroup1.name = userGroup1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userGroup0, userGroup1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${userGroup0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('USER_GROUP.NAME'), id: userGroup0.id }));
    });

    test(`2.2: Actualizar UserGroup que non existe:`, async() => {
        const userGroup0 = new UserGroup(dataList.userGroups[0]);

        // Modificase o modelo UserGroup
        userGroup0.name = userGroup0.name + FAKE_TEXT;

        do {
            userGroup0.id = new ObjectId();
        } while (userGroup0.id == dataList.userGroups[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${userGroup0.id}`).send(userGroup0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_GROUP.NAME'), id: userGroup0.id }));
    });
});
