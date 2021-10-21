// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';

import { AssignedUser } from '../../../src/models/assigned-user.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    FAKE_TEXT,
    request
} from "../commons";
import { User } from "../../../src/models/user.model";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - AssignedUsers (PATCH)', () => {
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
    test(`Actualizar AssignedUser: <${dataList.assignedUsers[0].id}>`, async() => {
        const assignedUser0 = dataList.assignedUsers[0] as AssignedUser;
        const assignedUser1 = dataList.assignedUsers[0] as AssignedUser;

        // Modificase o modelo AssignedUser
        assignedUser1.assignedUser = dataList.users[0].id != assignedUser1.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedUser0, assignedUser1);

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
        expect(data.assignedUser).toBeDefined();
        expect(data.assignedUser.id).not.toBe(assignedUser0.assignedUser.id);
        expect(data.assignedUser.id).toBe(assignedUser1.assignedUser.id);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedUser0.id);
        expect(data.id).toBe(assignedUser1.id);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar AssignedUser con datos erróneos:`, async() => {
        const assignedUser0 = dataList.assignedUsers[0] as AssignedUser;
        const assignedUser1 = dataList.assignedUsers[0] as AssignedUser;

        // Modificase o modelo AssignedUser
        assignedUser1.assignedUser = dataList.users[0].id != assignedUser1.assignedUser.id
        ? dataList.users[0] as User
        : dataList.users[1] as User;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(assignedUser0, assignedUser1);

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

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.ERROR.UPDATE'));
    });
});
