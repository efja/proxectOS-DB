// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import { date2LocaleISO } from "../../../src/helpers/date.helper";

import { Project } from '../../../src/models/project.model';

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
describe('1: Probas DATOS API - Projects (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "projects";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.projects, true);
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
    test('1.1: Consultar tódolos Projects:', async() => {
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

        const dataLength = dataList.projects.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(dataList.projects[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('PROJECT.NAME_PLURAL') }));
    });

    test('1.2: Consultar tódolos Projects con parámetros de filtrado:', async() => {
        const valueFilter = 'Test';
        const queryParameters = qs.stringify(
            {
                limit: 0,
                orderBy: [{ name: "ASC" }],
                name: valueFilter
            },
            { arrayFormat: 'repeat' }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const projects: Project[] = (dataList.projects as Project[]).filter(item => item.name.includes(valueFilter));

        const dataLength = projects.length;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);

        expect(data).toBeDefined();
        expect(data).toHaveLength(dataLength);
        expect(data[0].id).toBe(projects[0].id);

        expect(total).toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('SUCCESS.GET_LIST', { entity: i18next.t('PROJECT.NAME_PLURAL') }));
    });

    test(`1.3: Consultar Project: <${dataList.projects[0].id}>`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.projects[0].id}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        const project = dataList.projects[0] as Project;

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(project.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(project.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(project.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(date2LocaleISO(data.startDate))).toBe(date2LocaleISO(project.startDate));
        expect(date2LocaleISO(date2LocaleISO(data.targetFinishDate))).toBe(date2LocaleISO(project.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('PROJECT.NAME'), id: project.id }));
    });

    test(`1.4: Consultar Project: <${dataList.projects[0].id}> con parámetros de filtrado`, async() => {
        const project = dataList.projects[0] as Project;

        const queryParameters = qs.stringify(
            {
                name: project.name
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${project.id}?${queryParameters}`);
        const {
            code,
            data,
            message,
            error,
        } = response.body

        expect(error).toBeUndefined();
        expect(message).toBeDefined();

        expect(response.status).toBe(HttpStatus.OK);
        expect(code).toBe(HttpStatus.OK);
        expect(data).toBeDefined();

        // Comprobanse algúns datos obrigatorios
        expect(data.id).toBeDefined();
        expect(data.id).toBe(project.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(project.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(project.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(date2LocaleISO(data.startDate))).toBe(date2LocaleISO(project.startDate));
        expect(date2LocaleISO(date2LocaleISO(data.targetFinishDate))).toBe(date2LocaleISO(project.targetFinishDate));

        expect(message).toBe(i18next.t('SUCCESS.GET', { entity: i18next.t('PROJECT.NAME'), id: project.id }));
    });
});

describe('2: Probas DATOS API - Projects ERROS (GET)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "projects";

    // ************************************************************************************************
    // ** TAREFAS PREVIAS E POSTERIORES
    // ************************************************************************************************
	beforeAll(async () => {
        await db.init();
		await db.dropCollections();

        await runApp();
	});

	beforeEach(async () => {
        await db.inicializeData(dataList.projects, true);
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
    test('2.1: Consultar tódolos Projects con parámetros de filtrado :', async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$re': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}?${queryParameters}`);
        const {
            code,
            data,
            total,
            from,
            limit,
            message,
            error,
        } = response.body

        const dataLength = dataList.projects.length;

        expect(error).toBeDefined();
        expect(message).toBeUndefined();

        expect(response.status).toBe(HttpStatus.NOT_FOUND);
        expect(code).toBe(HttpStatus.NOT_FOUND);
        expect(data).toBeUndefined();

        expect(total).toBe(0);
        expect(total).not.toBe(dataLength);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND_LIST', { entity: i18next.t('PROJECT.NAME_PLURAL') }));
    });

    test(`2.2: Consultar Project: <${dataList.projects[0].id}> con parámetros de filtrado`, async() => {
        const queryParameters = qs.stringify(
            {
                name: {'$re': FAKE_TEXT }
            }
        );

        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.projects[0].id}?${queryParameters}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('PROJECT.NAME'), id: dataList.projects[0].id }));
    });

    test(`2.3: Consultar Project inexistente:`, async() => {
        const response = await request.get(`${API_BASE}/${ENDPOINT}/${dataList.projects[0].id}${FAKE_TEXT}`);
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

        expect(error).toBe(i18next.t('ERROR.NOT_FOUND', { entity: i18next.t('PROJECT.NAME'), id: `${dataList.projects[0].id}${FAKE_TEXT}` }));
    });
});
