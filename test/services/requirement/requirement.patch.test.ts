// ##################################################################################################
// ## IMPORTACIÓNS
// ##################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

import { date2LocaleISO } from "../../../src/helpers/date.helper";

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

// ##################################################################################################
// ## TESTS GROUPS
// ##################################################################################################
describe('1: Probas DATOS API - Requirements (PATCH)', () => {
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
        await db.inicializeData(dataList.requirements);
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
    test(`1.1: Actualizar Requirement: <${dataList.requirements[0].id}>`, async() => {
        const requirement0 = new Requirement(dataList.requirements[0]);
        const requirement1 = new Requirement(dataList.requirements[0]);

        // Modificase o modelo Requirement
        requirement1.name = requirement1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(requirement0, requirement1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${requirement0.id}`).send(objPatch);
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

        // ** Datos cambiados
        expect(data.name).toBeDefined();
        expect(data.name).not.toBe(requirement0.name);
        expect(data.name).toBe(requirement1.name);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(requirement0.id);
        expect(data.id).toBe(requirement1.id);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(requirement0.description);
        expect(data.description).toBe(requirement1.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(requirement0.startDate));
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(requirement1.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(requirement0.targetFinishDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(requirement1.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.UPDATE', { entity: i18next.t('REQUIREMENT.NAME'), id: requirement1.id }));
    });

});

describe('2: Probas DATOS API - Requirements ERROS (PATCH)', () => {
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
        await db.inicializeData(dataList.requirements);
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
    test(`2.1: Actualizar Requirement con datos erróneos:`, async() => {
        const requirement0 = new Requirement(dataList.requirements[0]);
        const requirement1 = new Requirement(dataList.requirements[0]);

        // Modificase o modelo Requirement
        requirement1.name = requirement1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(requirement0, requirement1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${requirement0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('REQUIREMENT.NAME'), id: requirement0.id }));
    });

    test(`2.2: Actualizar Requirement que non existe:`, async() => {
        const requirement0 = new Requirement(dataList.requirements[0]);

        // Modificase o modelo Requirement
        requirement0.name = requirement0.name + FAKE_TEXT;

        do {
            requirement0._id = new ObjectId();
        } while (requirement0._id == dataList.requirements[0]._id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${requirement0.id}`).send(requirement0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('REQUIREMENT.NAME'), id: requirement0.id }));
    });
});
