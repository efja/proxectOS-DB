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
describe('Probas DATOS API - RepositoryApps (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "repositoryApps";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.repositories, true);
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
    test('Tódolos RepositoryApps:', async() => {
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
        expect(data).toHaveLength(dataList.repositories.length);
        expect(data[0].id).toBe(dataList.repositories[0].id);

        expect(total).toBe(dataList.repositories.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.GET_ALL'));
    });

    test(`RepositoryApp: <${dataList.repositories[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.repositories[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const repositoryApp = dataList.repositories[0] as RepositoryApp;

        expect(error).toBeUndefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(repositoryApp.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(repositoryApp.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(repositoryApp.description);

        // Comprobanse algúns datos opcionais
        expect(data.expirationDate).toBe(repositoryApp.expirationDate);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.GET_SINGLE'));
    });

    test(`RepositoryApp inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.repositories[0].id}${FAKE_TEXT}`);
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

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.GET_SINGLE'));
    });
});
