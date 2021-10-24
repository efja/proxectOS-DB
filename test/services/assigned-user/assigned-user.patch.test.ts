// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

import { AssignedUser } from '../../../src/models/assigned-user.model';
import { User } from "../../../src/models/user.model";

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
describe('1: Probas DATOS API - AssignedUsers (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedUsers";

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
        await db.inicializeData(dataList.assignedUsers);
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
    test(`1.1: Actualizar AssignedUser: <${dataList.assignedUsers[0].id}>`, async() => {
        const assignedUser0 = new AssignedUser(dataList.assignedUsers[0]);
        const assignedUser1 = new AssignedUser(dataList.assignedUsers[0]);

        // Modificase o modelo AssignedUser
        assignedUser0.assignedUser = dataList.users[0].id != assignedUser0.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedUser0, assignedUser1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${assignedUser0.id}`).send(objPatch);
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
        expect(data.assignedUser).toBeDefined();
        expect(data.assignedUser).not.toBe(assignedUser0.assignedUser);
        expect(data.assignedUser).toBe(assignedUser1.assignedUser);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedUser0.id);
        expect(data.id).toBe(assignedUser1.id);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.UPDATE'));
    });

});

describe('2: Probas DATOS API - AssignedUsers ERROS (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedUsers";

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
        await db.inicializeData(dataList.assignedUsers);
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
    test(`2.1: Actualizar AssignedUser con datos erróneos:`, async() => {
        const assignedUser0 = new AssignedUser(dataList.assignedUsers[0]);
        const assignedUser1 = new AssignedUser(dataList.assignedUsers[0]);

        // Modificase o modelo AssignedUser
        assignedUser1.assignedUser = dataList.users[0].id != assignedUser0.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedUser0, assignedUser1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${assignedUser0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser0.id }));
    });

    test(`2.2: Actualizar AssignedUser que non existe:`, async() => {
        const assignedUser0 = new AssignedUser(dataList.assignedUsers[0]);

        // Modificase o modelo AssignedUser
        assignedUser0.assignedUser = dataList.users[0].id != assignedUser0.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        do {
            assignedUser0.id = new ObjectId();
        } while (assignedUser0.id == dataList.assignedUsers[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedUser0.id}`).send(assignedUser0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_MALE', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser0.id }));
    });
});
