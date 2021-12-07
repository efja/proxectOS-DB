// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from "@mikro-orm/mongodb";

import { UserGroup } from '../../../src/models/user-group.model';
import { CommentApp } from '../../../src/models/commentapp.model';

import {
    app,
    runApp,

    API_BASE,
    dataList,
    db,

    request
} from "../commons";

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - UserGroups (POST)', () => {
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

        await runApp();
	});

	beforeEach(async () => {
        await db.createCollections();
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
    test(`1.1: Crear UserGroup: <${dataList.userGroups[0].id}>`, async() => {
        const userGroup = dataList.userGroups[0] as UserGroup;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userGroup);
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
        expect(data.id).toBe(userGroup.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(userGroup.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userGroup.description);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('USER_GROUP.NAME') }));
    });

    test('1.2: Crear lista de UserGroups:', async() => {
        const userGroups = [
            new UserGroup(dataList.userGroups[0]),
            new UserGroup(dataList.userGroups[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        userGroups[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        userGroups[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userGroups[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        userGroups[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(userGroups);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = userGroups.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userGroups[0].id);
        expect(data[0].id).not.toBe(userGroups[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userGroups[1].id);
        expect(data[1].id).not.toBe(userGroups[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('USER_GROUP.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - UserGroups ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userGroups";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userGroups, true);
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
    test(`2.1: Crear UserGroup con datos erróneos:`, async() => {
        const badUserGroup = dataList.comments[0] as CommentApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserGroup);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('USER_GROUP.NAME') }));
    });

    test(`2.2: Crear UserGroup: <${dataList.userGroups[0].id}> QUE XA EXISTE`, async() => {
        const userGroup = dataList.userGroups[0] as UserGroup;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userGroup);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('USER_GROUP.NAME'), id: userGroup.id }));
    });

    test('2.3: Crear lista de UserGroups algúns con datos erróneos:', async() => {
        const badUserGroups = [
            new UserGroup(dataList.userGroups[0]),
            new UserGroup(dataList.comments[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserGroups[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        badUserGroups[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserGroups[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        badUserGroups[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badUserGroups);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badUserGroups.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('USER_GROUP.NAME_PLURAL') }));
    });
});