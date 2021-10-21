// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Requirement } from '../../../src/models/requirement.model';
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
describe('Probas DATOS API - Requirements (GET)', () => {
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

	afterAll(async () => {
        await app.stop();

		await db.dropAllData(dataList.allModels);
		await db.dropCollections();
		await db.close();
	});

    // ************************************************************************************************
    // ** TESTS
    // ************************************************************************************************
    test('Tódolos Requirements:', async() => {
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

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataList.requirements.length);
        expect(data[0].id).toBe(dataList.requirements[0].id);

        expect(total).toBe(dataList.requirements.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`Requirement: <${dataList.requirements[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.requirements[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const requirement = dataList.requirements[0] as Requirement;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
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

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`Requirement inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.requirements[0].id}${FAKE_TEXT}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeDefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(message).toBe(i18next.t('REQUIREMENT.SERVICE.ERROR.GET_SINGLE'));
    });
});
