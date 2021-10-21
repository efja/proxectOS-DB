// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Requirement } from '../../../src/models/requirement.model';
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
describe('Probas DATOS API - Requirements (POST)', () => {
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
    test(`Crear Requirement: <${dataList.requirements[0].id}>`, async() => {
        const requirement = dataList.requirements[0] as Requirement;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(requirement);
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
        expect(data.id).toBe(requirement.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(requirement.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(requirement.description);

        // Comprobanse algúns datos opcionais
        expect(data.startDate).toBe(requirement.startDate);
        expect(data.targetFinishDate).toBe(requirement.targetFinishDate);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.CREATE'));
    });

    test(`Crear Requirement con datos erróneos:`, async() => {
        const badRequirement = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badRequirement);
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

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.ERROR.CREATE'));
    });

    test('Crear lista de Requirements:', async() => {
        const requirements = [
            dataList.requirements[0] as Requirement,
            dataList.requirements[0] as Requirement,
        ];

        // Se cambian los identificadores para evitar conflictos
        requirements[0]._id = "616c6b4c9c7900e7011c9615";
        requirements[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        requirements[1]._id = "616c6b6602067b3bd0d5ffbc";
        requirements[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(requirements);
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
        expect(data).toHaveLength(requirements.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(requirements[0]);
        expect(data[0].id).not.toBe(requirements[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(requirements[1]);
        expect(data[1].id).not.toBe(requirements[0]);

        expect(total).toBe(dataList.requirements.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('Crear lista de Requirements algúns con datos erróneos:', async() => {
        const badRequirements = [
            dataList.requirements[0] as Requirement,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badRequirements[0]._id = "616c6b4c9c7900e7011c9615";
        badRequirements[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badRequirements[1]._id = "616c6b6602067b3bd0d5ffbc";
        badRequirements[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badRequirements);
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
        expect(data).not.toHaveLength(badRequirements.length);

        expect(total).not.toBe(badRequirements.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.ERROR.CREATE_LIST'));
    });
});
