// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Type } from '../../../src/models/type.model';
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

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('Probas DATOS API - Types (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "types";

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
    test(`Crear Type: <${dataList.types[0].id}>`, async() => {
        const type = dataList.types[0] as Type;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(type);
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
        expect(data.id).toBe(type.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(type.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(type.description);

        expect(message).toBe(i18next.t('TYPE.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear Type con datos erróneos:`, async() => {
        const badType = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badType);
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

        expect(message).toBe(i18next.t('TYPE.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de Types:', async() => {
        const types = [
            dataList.types[0] as Type,
            dataList.types[0] as Type,
        ];

        // Se cambian los identificadores para evitar conflictos
        types[0]._id = "616c6b4c9c7900e7011c9615";
        types[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        types[1]._id = "616c6b6602067b3bd0d5ffbc";
        types[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(types);
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
        expect(data).toHaveLength(types.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(types[0]);
        expect(data[0].id).not.toBe(types[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(types[1]);
        expect(data[1].id).not.toBe(types[0]);

        expect(total).toBe(dataList.types.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('TYPE.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de Types algúns con datos erróneos:', async() => {
        const badTypes = [
            dataList.types[0] as Type,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badTypes[0]._id = "616c6b4c9c7900e7011c9615";
        badTypes[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badTypes[1]._id = "616c6b6602067b3bd0d5ffbc";
        badTypes[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badTypes);
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
        expect(data).not.toHaveLength(badTypes.length);

        expect(total).not.toBe(badTypes.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('TYPE.SERVICE.ERROR.CREATE_LIST'));
    });
});
