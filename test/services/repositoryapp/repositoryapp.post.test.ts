// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { RepositoryApp } from '../../../src/models/repositoryapp.model';
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
import { date2LocaleISO } from "../../../src/helpers/date.helper";

// ####################################################################################################
// ## TESTS GROUPS
// ####################################################################################################
describe('1: Probas DATOS API - RepositoryApps (POST)', () => {
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
    test(`1.1: Crear RepositoryApp: <${dataList.repositories[0].id}>`, async() => {
        const repositoryApp = dataList.repositories[0] as RepositoryApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(repositoryApp);
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
        expect(data.id).toBe(repositoryApp.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(repositoryApp.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(repositoryApp.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.expirationDate)).toBe(date2LocaleISO(repositoryApp.expirationDate));

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.CREATE'));
    });

    test(`1.2: Crear RepositoryApp con datos erróneos:`, async() => {
        const badRepositoryApp = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badRepositoryApp);
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

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.CREATE'));
    });

    test('1.3: Crear lista de RepositoryApps:', async() => {
        const repositoryApps = [
            dataList.repositories[0] as RepositoryApp,
            dataList.repositories[0] as RepositoryApp,
        ];

        // Se cambian los identificadores para evitar conflictos
        repositoryApps[0]._id = "616c6b4c9c7900e7011c9615";
        repositoryApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        repositoryApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        repositoryApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(repositoryApps);
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
        expect(data).toHaveLength(repositoryApps.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(repositoryApps[0]);
        expect(data[0].id).not.toBe(repositoryApps[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(repositoryApps[1]);
        expect(data[1].id).not.toBe(repositoryApps[0]);

        expect(total).toBe(dataList.repositories.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('1.4: Crear lista de RepositoryApps algúns con datos erróneos:', async() => {
        const badRepositoryApps = [
            dataList.repositories[0] as RepositoryApp,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badRepositoryApps[0]._id = "616c6b4c9c7900e7011c9615";
        badRepositoryApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badRepositoryApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        badRepositoryApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badRepositoryApps);
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
        expect(data).not.toHaveLength(badRepositoryApps.length);

        expect(total).not.toBe(badRepositoryApps.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.CREATE_LIST'));
    });
});
