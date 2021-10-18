// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { UserGroup } from '../../../src/models/user-group.model';

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
describe('Probas DATOS API - UserGroups (PATCH)', () => {
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
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userGroups);
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
    test(`Actualizar UserGroup: <${dataList.userGroups[0].id}>`, async() => {
        const userGroup0 = dataList.userGroups[0] as UserGroup;
        const userGroup1 = dataList.userGroups[0] as UserGroup;

        // Modificase o modelo UserGroup
        userGroup1.name = userGroup1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userGroup0, userGroup1);

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

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar UserGroup con datos erróneos:`, async() => {
        const userGroup0 = dataList.userGroups[0] as UserGroup;
        const userGroup1 = dataList.userGroups[0] as UserGroup;

        // Modificase o modelo UserGroup
        userGroup1.name = userGroup1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(userGroup0, userGroup1);

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

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.ERROR.UPDATE'));
    });
});
