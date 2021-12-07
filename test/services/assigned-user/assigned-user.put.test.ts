// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from '@mikro-orm/mongodb';

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

import { createAssignedUser } from "../../db/transform-data.helper";

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - AssignedUsers (PUT)', () => {
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
        const assignedUser = createAssignedUser(dataList.assignedUsers[0], db);

        const assignedUseraId = assignedUser.id;
        const assignedUserassignedUserId = assignedUser.assignedUser.id;
        const repo = db.orm.em.getRepository(User);

        // Modificase o modelo AssignedUser (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        if (assignedUser.assignedUser.id != dataList.users[0].id) {
            assignedUser.assignedUser = repo.getReference(dataList.users[0].id, true);
        } else {
            assignedUser.assignedUser = repo.getReference(dataList.users[1].id, true);
        }

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${dataList.assignedUsers[0].id}`).send(assignedUser);
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
        expect(data.assignedUser).not.toBe(assignedUserassignedUserId);
        expect(data.assignedUser).toBe(assignedUser.assignedUser.id);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedUseraId);
        expect(data.id).toBe(assignedUser.id);

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser.id }));
    });
});

describe('1: Probas DATOS API - AssignedUsers ERROS (PUT)', () => {
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
        const assignedUser = createAssignedUser(dataList.assignedUsers[0], db);

        // Modificase o modelo AssignedUser
        assignedUser.assignedUser = dataList.users[0].id != assignedUser.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        const assignedUser1 = assignedUser as any;
        assignedUser1.createdAt = FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedUser.id}`).send(assignedUser1);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser.id }));
    });

    test(`2.2: Actualizar AssignedUser que non existe:`, async() => {
        const assignedUser = new AssignedUser(dataList.assignedUsers[0]);

        // Modificase o modelo AssignedUser
        assignedUser.assignedUser = dataList.users[0].id != assignedUser.assignedUser.id
            ? dataList.users[0] as User
            : dataList.users[1] as User;

        do {
            assignedUser._id = new ObjectId();
        } while (assignedUser._id == dataList.assignedUsers[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${assignedUser.id}`).send(assignedUser);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser.id }));
    });
});
