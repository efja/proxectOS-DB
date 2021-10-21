// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { Role } from '../../../src/models/role.model';

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
describe('Probas DATOS API - Roles (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "roles";

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
        await db.inicializeData(dataList.roles);
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
    test(`Actualizar Role: <${dataList.roles[0].id}>`, async() => {
        const role0 = dataList.roles[0] as Role;
        const role1 = dataList.roles[0] as Role;

        // Modificase o modelo Role
        role1.name = role1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(role0, role1);

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
        expect(data.name).not.toBe(role0.name);
        expect(data.name).toBe(role1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(role0.id);
        expect(data.id).toBe(role1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(role0.description);
        expect(data.description).toBe(role1.description);

        // Comprobanse algúns datos opcionais
        expect(data.create).toBe(role0.create);
        expect(data.create).toBe(role1.create);
        expect(data.delete).toBe(role0.delete);
        expect(data.delete).toBe(role1.delete);

        expect(message).toBe(i18next.t('ROLE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar Role con datos erróneos:`, async() => {
        const role0 = dataList.roles[0] as Role;
        const role1 = dataList.roles[0] as Role;

        // Modificase o modelo Role
        role1.name = role1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(role0, role1);

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

        expect(message).toBe(i18next.t('ROLE.SERVICE.ERROR.UPDATE'));
    });
});
