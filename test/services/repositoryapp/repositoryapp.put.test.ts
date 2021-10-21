// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

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
describe('Probas DATOS API - RepositoryApps (PUT)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "repositoryApps";

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
    test(`Actualizar RepositoryApp: <${dataList.repositories[0].id}>`, async() => {
        const repositoryApp0 = dataList.repositories[0] as RepositoryApp;
        const repositoryApp1 = dataList.repositories[0] as RepositoryApp;

        // Modificase o modelo RepositoryApp (para empregar o verbo PUT deberíase modifcar todo o obxecto pero para as probas vale)
        repositoryApp1.name = repositoryApp1.name + FAKE_TEXT;
        repositoryApp1.description = repositoryApp1.description + FAKE_TEXT;

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(repositoryApp1);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
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
        expect(data.expirationDate).toBe(repositoryApp0.expirationDate);
        expect(data.expirationDate).toBe(repositoryApp1.expirationDate);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.UPDATE'));
    });

    test(`Actualizar RepositoryApp con datos erróneos:`, async() => {
        const repositoryApp0 = dataList.repositories[0] as RepositoryApp;

        // Modificase o modelo RepositoryApp
        repositoryApp0.name = repositoryApp0.name + FAKE_TEXT;

        const repositoryApp1 = repositoryApp0 as any;
        repositoryApp1.expirationDate = repositoryApp0.name + FAKE_TEXT; // Dato erróneo

        const response = await request.put(`${API_BASE}/${ENDPOINT}/`).send(repositoryApp1);
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

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.UPDATE'));
    });
});
