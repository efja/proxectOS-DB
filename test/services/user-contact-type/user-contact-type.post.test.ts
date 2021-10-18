// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { User } from "../../../src/models/user.model";
import { UserContactType } from '../../../src/models/user-contact-type.model';

import {
    API_BASE,
    dataList,
    db,
    request
} from "../commons";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - UserContactTypes (POST)', () => {
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
    test(`Crear UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const userContactType = dataList.userContactTypes[0] as UserContactType;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(userContactType);
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
        expect(data.id).toBe(userContactType.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userContactType.description);

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear UserContactType con datos erróneos:`, async() => {
        const badUserContactType = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badUserContactType);
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

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de UserContactTypes:', async() => {
        const userContactTypes = [
            dataList.userContactTypes[0] as UserContactType,
            dataList.userContactTypes[0] as UserContactType,
        ];

        // Se cambian los identificadores para evitar conflictos
        userContactTypes[0]._id = "616c6b4c9c7900e7011c9615";
        userContactTypes[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        userContactTypes[1]._id = "616c6b6602067b3bd0d5ffbc";
        userContactTypes[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(userContactTypes);
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
        expect(data).toHaveLength(userContactTypes.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(userContactTypes[0]);
        expect(data[0].id).not.toBe(userContactTypes[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(userContactTypes[1]);
        expect(data[1].id).not.toBe(userContactTypes[0]);

        expect(total).toBe(dataList.userContactTypes.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de UserContactTypes algúns con datos erróneos:', async() => {
        const badUserContactTypes = [
            dataList.userContactTypes[0] as UserContactType,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badUserContactTypes[0]._id = "616c6b4c9c7900e7011c9615";
        badUserContactTypes[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badUserContactTypes[1]._id = "616c6b6602067b3bd0d5ffbc";
        badUserContactTypes[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badUserContactTypes);
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
        expect(data).not.toHaveLength(badUserContactTypes.length);

        expect(total).not.toBe(badUserContactTypes.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('USER_CONTACT_TYPE.SERVICE.ERROR.CREATE_LIST'));
    });
});
