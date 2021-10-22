// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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
describe('1: Probas DATOS API - Roles (PUT)', () => {
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
    test(`1.1: Actualizar Role: <${dataList.roles[0].id}>`, async() => {
        const role0 = dataList.roles[0] as Role;
        const role1 = dataList.roles[0] as Role;

        // Modificase o modelo Role (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        role1.name = role1.name + FAKE_TEXT;
        role1.description = role1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(role1);
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

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(role0.description);
        expect(data.description).toBe(role1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(role0.id);
        expect(data.id).toBe(role1.id);

        // Comprobanse algúns datos opcionais
        expect(data.create).toBe(role0.create);
        expect(data.create).toBe(role1.create);
        expect(data.delete).toBe(role0.delete);
        expect(data.delete).toBe(role1.delete);

        expect(message).toBe(i18next.t('ROLE.SERVICE.SUCCESS.UPDATE'));
    });

    test(`1.2: Actualizar Role con datos erróneos:`, async() => {
        const role0 = dataList.roles[0] as Role;

        // Modificase o modelo Role
        role0.name = role0.name + FAKE_TEXT;

        const role1 = role0 as any;
        role1.create = role0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(role1);
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
