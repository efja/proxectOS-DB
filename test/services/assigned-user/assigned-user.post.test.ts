// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { AssignedUser } from '../../../src/models/assigned-user.model';
import { User } from "../../../src/models/user.model";

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - AssignedUsers (POST)', () => {
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
        await db.createCollections();
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
    test(`1.1: Crear AssignedUser: <${dataList.assignedUsers[0].id}>`, async() => {
        const assignedUser = dataList.assignedUsers[0] as AssignedUser;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedUser);
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

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(assignedUser.id);

        expect(data.assignedUser).toBeDefined();
        expect(data.assignedUser).toBe(assignedUser.assignedUser);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.createdAt)).toBe(date2LocaleISO(assignedUser.createdAt));

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.CREATE'));
    });

    test('1.2: Crear lista de AssignedUsers:', async() => {
        const assignedUsers = [
            new AssignedUser(dataList.assignedUsers[0]),
            new AssignedUser(dataList.assignedUsers[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        assignedUsers[0]._id = "616c6b4c9c7900e7011c9615";
        assignedUsers[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        assignedUsers[1]._id = "616c6b6602067b3bd0d5ffbc";
        assignedUsers[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(assignedUsers);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = assignedUsers.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(assignedUsers[0].id);
        expect(data[0].id).not.toBe(assignedUsers[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(assignedUsers[1].id);
        expect(data[1].id).not.toBe(assignedUsers[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('ASSIGNED_USER.SERVICE.SUCCESS.CREATE_LIST'));
    });
});

describe('2: Probas DATOS API - AssignedUsers ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "assignedUsers";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.assignedUsers, true);
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
    test(`2.1: Crear AssignedUser con datos erróneos:`, async() => {
        const badAssignedUser = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badAssignedUser);
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

        expect(error).toBe(i18next.t('ASSIGNED_USER.SERVICE.ERROR.CREATE'));
    });

    test(`2.2: Crear AssignedUser: <${dataList.assignedUsers[0].id}> QUE XA EXISTE`, async() => {
        const assignedUser = dataList.assignedUsers[0] as AssignedUser;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(assignedUser);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST_MALE', { entity: i18next.t('ASSIGNED_USER.NAME'), id: assignedUser.id }));
    });

    test('2.3: Crear lista de AssignedUsers algúns con datos erróneos:', async() => {
        const badAssignedUsers = [
            new AssignedUser(dataList.assignedUsers[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badAssignedUsers[0]._id = "616c6b4c9c7900e7011c9615";
        badAssignedUsers[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badAssignedUsers[1]._id = "616c6b6602067b3bd0d5ffbc";
        badAssignedUsers[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badAssignedUsers);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badAssignedUsers.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ASSIGNED_USER.SERVICE.ERROR.CREATE_LIST'));
    });
});