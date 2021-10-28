// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { UserContactType } from '../../../src/models/user-contact-type.model';

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
describe('1: Probas DATOS API - UserContactTypes (GET)', () => {
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
    test('1.1: Consultar tódolos UserContactTypes:', async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.userContactTypes.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.userContactTypes[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos UserContactTypes con parámetros de filtrado:', async() => {
        const valueFilter = 'Teléfono';
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ description: "ASC" }],
                description: {'$re': valueFilter }
            },
            { arrayFormat: 'repeat' }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const userContactTypes: UserContactType[] = (dataList.userContactTypes as UserContactType[]).filter(item => item.description.includes(valueFilter));

        const dataLength = userContactTypes.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(userContactTypes[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME_PLURAL') }));
    });

    test(`1.3: Consultar UserContactType: <${dataList.userContactTypes[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.userContactTypes[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const userContactType = dataList.userContactTypes[0] as UserContactType;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContactType.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userContactType.description);

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType.id }));
    });

    test(`1.4: Consultar UserContactType: <${dataList.userContactTypes[0].id}> con parámetros de filtrado`, async() => {
        const userContactType = dataList.userContactTypes[0] as UserContactType;

        const queryParameters = qs.stringify(
            {
                description: {'$re': userContactType.description }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${userContactType.id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(userContactType.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(userContactType.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(date2LocaleISO(data.createdAt))).toBe(date2LocaleISO(userContactType.createdAt));

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: userContactType.id }));
    });
});

describe('2: Probas DATOS API - UserContactTypes ERROS (GET)', () => {
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
    test('2.1: Consultar tódolos UserContactTypes con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$re': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.userContactTypes.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('USER_CONTACT_TYPE.NAME_PLURAL') }));
    });

    test(`2.2: Consultar UserContactType: <${dataList.userContactTypes[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$re': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.userContactTypes[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: dataList.userContactTypes[0].id }));
    });

    test(`2.3: Consultar UserContactType inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.userContactTypes[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('USER_CONTACT_TYPE.NAME'), id: `${dataList.userContactTypes[0].id}${FAKE_TEXT}` }));
    });
});
