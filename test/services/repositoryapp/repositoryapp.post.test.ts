// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { RepositoryApp } from '../../../src/models/repositoryapp.model';
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
describe('1: Probas DATOS API - RepositoryApps (POST)', () => {
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
        expect(message).toBeDefined();

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

    test('1.2: Crear lista de RepositoryApps:', async() => {
        const repositories = [
            new RepositoryApp(dataList.repositories[0]),
            new RepositoryApp(dataList.repositories[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        repositories[0]._id = "616c6b4c9c7900e7011c9615";
        repositories[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        repositories[1]._id = "616c6b6602067b3bd0d5ffbc";
        repositories[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(repositories);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = repositories.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.CREATED);
        expect(code).toBe(HttpStatus.CREATED);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(repositories[0].id);
        expect(data[0].id).not.toBe(repositories[1].id);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(repositories[1].id);
        expect(data[1].id).not.toBe(repositories[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('REPOSITORY.SERVICE.SUCCESS.CREATE_LIST'));
    });
});

describe('2: Probas DATOS API - RepositoryApps ERROS (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "repositories";

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
    test(`2.1: Crear RepositoryApp con datos erróneos:`, async() => {
        const badRepositoryApp = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badRepositoryApp);
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

        expect(error).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.CREATE'));
    });

    test(`2.2: Crear RepositoryApp: <${dataList.repositories[0].id}> QUE XA EXISTE`, async() => {
        const repositoryApp = dataList.repositories[0] as RepositoryApp;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(repositoryApp);
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

        expect(error).toBe(i18next.t('ERROR.ALREADY_EXIST', { entity: i18next.t('REPOSITORY.NAME'), id: repositoryApp.id }));
    });

    test('2.3: Crear lista de RepositoryApps algúns con datos erróneos:', async() => {
        const badRepositoryApps = [
            new RepositoryApp(dataList.repositories[0]),
            new User(dataList.users[0]),
        ];

        // Se cambian los identificadores para evitar conflictos
        badRepositoryApps[0]._id = "616c6b4c9c7900e7011c9615";
        badRepositoryApps[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badRepositoryApps[1]._id = "616c6b6602067b3bd0d5ffbc";
        badRepositoryApps[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}/Multiple`).send(badRepositoryApps);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = badRepositoryApps.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.CONFLICT);
        expect(code).toBe(HttpStatus.CONFLICT);

        expect(data).toBeUndefined();

        expect(total).not.toBe(dataLength);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('REPOSITORY.SERVICE.ERROR.CREATE_LIST'));
    });
});