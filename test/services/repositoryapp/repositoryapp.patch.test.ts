// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import * as jsonpatch from 'fast-json-patch';
import { ObjectId } from "@mikro-orm/mongodb";

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { RepositoryApp } from '../../../src/models/repositoryapp.model';

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
describe('1: Probas DATOS API - RepositoryApps (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "repositories";

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
        await db.inicializeData(dataList.repositories);
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
    test(`1.1: Actualizar RepositoryApp: <${dataList.repositories[0].id}>`, async() => {
        const repositoryApp0 = new RepositoryApp(dataList.repositories[0]);
        const repositoryApp1 = new RepositoryApp(dataList.repositories[0]);

        // Modificase o modelo RepositoryApp
        repositoryApp1.name = repositoryApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(repositoryApp0, repositoryApp1);

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${repositoryApp0.id}`).send(objPatch);
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
        expect(data.name).not.toBe(repositoryApp0.name);
        expect(data.name).toBe(repositoryApp1.name);

        expect(data.description).toBeDefined();
        expect(data.description).not.toBe(repositoryApp0.description);
        expect(data.description).toBe(repositoryApp1.description);

        // ** Datos NON cambiados
        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(repositoryApp0.id);
        expect(data.id).toBe(repositoryApp1.id);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(repositoryApp0.expirationDate));
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(repositoryApp1.expirationDate));

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.UPDATE'));
    });

});

describe('2: Probas DATOS API - RepositoryApps ERROS (PATCH)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "repositories";

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
        await db.inicializeData(dataList.repositories);
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
    test(`2.1: Actualizar RepositoryApp con datos erróneos:`, async() => {
        const repositoryApp0 = new RepositoryApp(dataList.repositories[0]);
        const repositoryApp1 = new RepositoryApp(dataList.repositories[0]);

        // Modificase o modelo RepositoryApp
        repositoryApp1.name = repositoryApp1.name + FAKE_TEXT;

        // Xerase o objexecto tipo HTTP PATCH
        const objPatch = jsonpatch.compare(repositoryApp0, repositoryApp1);

        objPatch[0].path = FAKE_TEXT; // Dato incorrecto

        const response = await request.patch(`${API_BASE}/${ENDPOINT}/${repositoryApp0.id}`).send(objPatch);
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

        expect(error).toBe(i18next.t('ERROR.CONFLICT', { entity: i18next.t('REPOSITORY.NAME'), id: repositoryApp0.id }));
    });

    test(`2.2: Actualizar RepositoryApp que non existe:`, async() => {
        const repositoryApp0 = new RepositoryApp(dataList.repositories[0]);

        // Modificase o modelo RepositoryApp
        repositoryApp0.name = repositoryApp0.name + FAKE_TEXT;

        do {
            repositoryApp0.id = new ObjectId();
        } while (repositoryApp0.id == dataList.repositories[0].id);

        const response = await request.put(`${API_BASE}/${ENDPOINT}/${repositoryApp0.id}`).send(repositoryApp0);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_MALE', { entity: i18next.t('REPOSITORY.NAME'), id: repositoryApp0.id }));
    });
});
