// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Project } from '../../../src/models/project.model';
import { User } from '../../../src/models/user.model';

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
describe('1: Probas DATOS API - Users (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "users";

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
    test(`1.1: Crear User: <${dataList.users[0].id}>`, async() => {
        const user = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(user);
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
        expect(data.id).toBe(user.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(user.name);

        expect(data.secondSurname).toBeDefined();
        expect(data.secondSurname).toBe(user.secondSurname);

        expect(message).toBe(i18next.t('USER.SERVICE.SUCCESS.CREATE'));
    });

    test(`1.2: Crear User con datos erróneos:`, async() => {
        const badUser = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badUser);
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

        expect(message).toBe(i18next.t('USER.SERVICE.ERROR.CREATE'));
    });

    test('1.3: Crear lista de Users:', async() => {
        const users = [
            dataList.users[0] as User,
            dataList.projects[0] as Project,
        ];

        // Se cambian los identificadores para evitar conflictos
        users[0]._id = "616c6b4c9c7900e7011c9615";
        users[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        users[1]._id = "616c6b6602067b3bd0d5ffbc";
        users[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(users);
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
        expect(data).toHaveLength(users.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(users[0]);
        expect(data[0].id).not.toBe(users[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(users[1]);
        expect(data[1].id).not.toBe(users[0]);

        expect(total).toBe(dataList.users.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('1.4: Crear lista de Users algúns con datos erróneos:', async() => {
        const badUsers = [
            dataList.users[0] as User,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badUsers[0]._id = "616c6b4c9c7900e7011c9615";
        badUsers[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUsers[1]._id = "616c6b6602067b3bd0d5ffbc";
        badUsers[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUsers);
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
        expect(data).not.toHaveLength(badUsers.length);

        expect(total).not.toBe(badUsers.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER.SERVICE.ERROR.CREATE_LIST'));
    });
});
