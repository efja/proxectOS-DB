// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { AssignedUser } from '../../../src/models/assigned-user.model';
import { User } from "../../../src/models/user.model";

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - AssignedUsers (POST)', () => {
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
	});

	beforeEach(async () => {
        await db.createCollections();
	});

	afterEach(async () => {
		await db.dropCollections();
	});

	afterAll(async () => {
		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test(`Crear AssignedUser: <${dataList.assignedUsers[0].id}>`, async() => {
        const assignedUser = dataList.assignedUsers[0] as AssignedUser;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedUser);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedUser.id);

        expect(data.assignedUser).toBeDefined();
        expect(data.assignedUser.id).toBe(assignedUser.assignedUser.id);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear AssignedUser con datos erróneos:`, async() => {
        const badAssignedUser = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badAssignedUser);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeUndefined();

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de AssignedUsers:', async() => {
        const assignedUsers = [
            dataList.assignedUsers[0] as AssignedUser,
            dataList.assignedUsers[0] as AssignedUser,
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedUsers[0]._id = "616c6b4c9c7900e7011c9615";
        assignedUsers[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedUsers[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedUsers[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(assignedUsers);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(assignedUsers.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedUsers[0]);
        expect(data[0].id).not.toBe(assignedUsers[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedUsers[1]);
        expect(data[1].id).not.toBe(assignedUsers[0]);

        expect(total).toBe(dataList.assignedUsers.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de AssignedUsers algúns con datos erróneos:', async() => {
        const badAssignedUsers = [
            dataList.assignedUsers[0] as AssignedUser,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedUsers[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedUsers[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedUsers[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedUsers[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedUsers);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();
        expect(data).not.toHaveLength(badAssignedUsers.length);

        expect(total).not.toBe(badAssignedUsers.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.ERROR.CREATE_LIST'));
    });
});
