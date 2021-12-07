// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import { ObjectId } from "@mikro-orm/mongodb";

import { UserContactType } from '../../../src/models/user-contact-type.model';
import { User } from "../../../src/models/user.model";

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
describe('1: Probas DATOS API - UserContactTypes (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userContactTypes";

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
    test(`1.1: Crear UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const userContactType = dataList.userContactTypes[0] as UserContactType;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userContactType);
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
        expect(data.id).toBe(userContactType.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userContactType.description);

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('USER_CONTACT_TYPE.NAME') }));
    });

    test('1.2: Crear lista de UserContactTypes:', async() => {
        const userContactTypes = [
            new UserContactType(dataList.userContactTypes[0]),
            new UserContactType(dataList.userContactTypes[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        userContactTypes[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        userContactTypes[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userContactTypes[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        userContactTypes[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(userContactTypes);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = userContactTypes.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userContactTypes[0].id);
        expect(data[0].id).not.toBe(userContactTypes[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userContactTypes[1].id);
        expect(data[1].id).not.toBe(userContactTypes[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);
        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - UserContactTypes ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "userContactTypes";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.userContactTypes, true);
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
    test(`2.1: Crear UserContactType con datos erróneos:`, async() => {
        const badUserContactType = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserContactType);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('USER_CONTACT_TYPE.NAME') }));
    });

    test(`2.2: Crear UserContactType: <${dataList.userContactTypes[0].id}> QUE XA EXISTE`, async() => {
        const userContactType = dataList.userContactTypes[0] as UserContactType;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userContactType);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType.id }));
    });

    test('2.3: Crear lista de UserContactTypes algúns con datos erróneos:', async() => {
        const badUserContactTypes = [
            new UserContactType(dataList.userContactTypes[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserContactTypes[0]._id = new ObjectId("616c6b4c9c7900e7011c9615");
        badUserContactTypes[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserContactTypes[1]._id = new ObjectId("616c6b6602067b3bd0d5ffbc");
        badUserContactTypes[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badUserContactTypes);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badUserContactTypes.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME_PLURAL') }));
    });
});