// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

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
describe('1: Probas DATOS API - Roles (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`1.1: Actualizar Role: <${dataList.roles[0].id}>`, async() => {
        const role0 = new Role(dataList.roles[0]);
        const role1 = new Role(dataList.roles[0]);

        // Modificase o modelo Role
        role1.name = role1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(role0, role1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${role0.id}`).send(objPatch);
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

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('ROLE.NAME'), id: dataList.projects[0].id }));
    });

});

describe('2: Probas DATOS API - Roles ERROS (PATCH)', () => {
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
		await db.dropCollections();
	});

	afterAll(async () => {
        await app.stop();

		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`2.1: Actualizar Role con datos erróneos:`, async() => {
        const role0 = new Role(dataList.roles[0]);
        const role1 = new Role(dataList.roles[0]);

        // Modificase o modelo Role
        role1.name = role1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(role0, role1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${role0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('ROLE.NAME'), id: role0.id }));
    });

    test(`2.2: Actualizar Role que non existe:`, async() => {
        const role0 = new Role(dataList.roles[0]);

        // Modificase o modelo Role
        role0.name = role0.name + FAKE_TEXT;

        do {
            role0.id = new ObjectId();
        } while (role0.id == dataList.roles[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${role0.id}`).send(role0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ROLE.NAME'), id: role0.id }));
    });
});
