// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { Requirement } from '../../../src/models/requirement.model';
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
describe('1: Probas DATOS API - Requirements (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "requirements";

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
    test(`1.1: Crear Requirement: <${dataList.requirements[0].id}>`, async() => {
        const requirement = dataList.requirements[0] as Requirement;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(requirement);
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
        expect(data.id).toBe(requirement.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(requirement.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(requirement.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(requirement.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(requirement.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.CREATE', { entity: i18next.t('REQUIREMENT.NAME') }));
    });

    test('1.2: Crear lista de Requirements:', async() => {
        const requirements = [
            new Requirement(dataList.requirements[0]),
            new Requirement(dataList.requirements[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        requirements[0]._id = "616c6b4c9c7900e7011c9615";
        requirements[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        requirements[1]._id = "616c6b6602067b3bd0d5ffbc";
        requirements[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(requirements);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = requirements.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(requirements[0].id);
        expect(data[0].id).not.toBe(requirements[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(requirements[1].id);
        expect(data[1].id).not.toBe(requirements[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.CREATE_LIST', { entity: i18next.t('REQUIREMENT.NAME_PLURAL') }));
    });
});

describe('2: Probas DATOS API - Requirements ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "requirements";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.requirements, true);
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
    test(`2.1: Crear Requirement con datos erróneos:`, async() => {
        const badRequirement = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badRequirement);
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

        expect(error).toBe(i18next.t('ERROR.CREATE', { entity: i18next.t('REQUIREMENT.NAME') }));
    });

    test(`2.2: Crear Requirement: <${dataList.requirements[0].id}> QUE XA EXISTE`, async() => {
        const requirement = dataList.requirements[0] as Requirement;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(requirement);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('REQUIREMENT.NAME'), id: requirement.id }));
    });

    test('2.3: Crear lista de Requirements algúns con datos erróneos:', async() => {
        const badRequirements = [
            new Requirement(dataList.requirements[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badRequirements[0]._id = "616c6b4c9c7900e7011c9615";
        badRequirements[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badRequirements[1]._id = "616c6b6602067b3bd0d5ffbc";
        badRequirements[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badRequirements);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badRequirements.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.CREATE_LIST', { entity: i18next.t('REQUIREMENT.NAME_PLURAL') }));
    });
});