// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { User } from "../../../src/models/user.model";
import { UserGroup } from '../../../src/models/user-group.model';

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
describe('Probas DATOS API - UserGroups (POST)', () => {
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
    test(`Crear UserGroup: <${dataList.userGroups[0].id}>`, async() => {
        const userGroup = dataList.userGroups[0] as UserGroup;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userGroup);
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
        expect(data.id).toBe(userGroup.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(userGroup.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userGroup.description);

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear UserGroup con datos erróneos:`, async() => {
        const badUserGroup = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badUserGroup);
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

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de UserGroups:', async() => {
        const userGroups = [
            dataList.userGroups[0] as UserGroup,
            dataList.userGroups[0] as UserGroup,
        ];

        // Se cambian los identificadores para evitar conflictos
        userGroups[0]._id = "616c6b4c9c7900e7011c9615";
        userGroups[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userGroups[1]._id = "616c6b6602067b3bd0d5ffbc";
        userGroups[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(userGroups);
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
        expect(data).toHaveLength(userGroups.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userGroups[0]);
        expect(data[0].id).not.toBe(userGroups[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userGroups[1]);
        expect(data[1].id).not.toBe(userGroups[0]);

        expect(total).toBe(dataList.userGroups.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de UserGroups algúns con datos erróneos:', async() => {
        const badUserGroups = [
            dataList.userGroups[0] as UserGroup,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserGroups[0]._id = "616c6b4c9c7900e7011c9615";
        badUserGroups[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserGroups[1]._id = "616c6b6602067b3bd0d5ffbc";
        badUserGroups[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserGroups);
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
        expect(data).not.toHaveLength(badUserGroups.length);

        expect(total).not.toBe(badUserGroups.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_GROUP.SERVICE.ERROR.CREATE_LIST'));
    });
});
