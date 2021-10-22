// ####################################################################################################
// ## IMPORTACIÓNS
// ####################################################################################################
import i18next from "i18next";
import HttpStatus from 'http-status-codes';

import { Project } from '../../../src/models/project.model';
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
describe('1: Probas DATOS API - Projects (POST)', () => {
    // ************************************************************************************************
    // ** ATRIBUTOS
    // ************************************************************************************************
    const ENDPOINT = "projects";

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
    test(`1.1: Crear Project: <${dataList.projects[0].id}>`, async() => {
        const project = dataList.projects[0] as Project;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(project);
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
        expect(data.id).toBe(project.id);

        expect(data.name).toBeDefined();
        expect(data.name).toBe(project.name);

        expect(data.description).toBeDefined();
        expect(data.description).toBe(project.description);

        // Comprobanse algúns datos opcionais
        expect(date2LocaleISO(data.startDate)).toBe(date2LocaleISO(project.startDate));
        expect(date2LocaleISO(data.targetFinishDate)).toBe(date2LocaleISO(project.targetFinishDate));

        expect(message).toBe(i18next.t('PROJECT.SERVICE.SUCCESS.CREATE'));
    });

    test(`1.2: Crear Project con datos erróneos:`, async() => {
        const badProject = dataList.users[0] as User;

        const response = await request.post(`${API_BASE}/${ENDPOINT}/`).send(badProject);
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

        expect(message).toBe(i18next.t('PROJECT.SERVICE.ERROR.CREATE'));
    });

    test('1.3: Crear lista de Projects:', async() => {
        const projects = [
            dataList.projects[0] as Project,
            dataList.projects[0] as Project,
        ];

        // Se cambian los identificadores para evitar conflictos
        projects[0]._id = "616c6b4c9c7900e7011c9615";
        projects[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        projects[1]._id = "616c6b6602067b3bd0d5ffbc";
        projects[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(projects);
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
        expect(data).toHaveLength(projects.length);
        expect(data[0]).toBeDefined();
        expect(data[0].id).toBe(projects[0]);
        expect(data[0].id).not.toBe(projects[1]);
        expect(data[1]).toBeDefined();
        expect(data[1].id).toBe(projects[1]);
        expect(data[1].id).not.toBe(projects[0]);

        expect(total).toBe(dataList.projects.length);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PROJECT.SERVICE.SUCCESS.CREATE_LIST'));
    });

    test('1.4: Crear lista de Projects algúns con datos erróneos:', async() => {
        const badProjects = [
            dataList.projects[0] as Project,
            dataList.users[0] as User,
        ];

        // Se cambian los identificadores para evitar conflictos
        badProjects[0]._id = "616c6b4c9c7900e7011c9615";
        badProjects[0].id  = "616c6b4c9c7900e7011c9615";

        // Se cambian los identificadores para evitar conflictos
        badProjects[1]._id = "616c6b6602067b3bd0d5ffbc";
        badProjects[1].id  = "616c6b6602067b3bd0d5ffbc";

        const response = await request.post(`${API_BASE}/${ENDPOINT}`).send(badProjects);
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
        expect(data).not.toHaveLength(badProjects.length);

        expect(total).not.toBe(badProjects.length);
        expect(total).toBe(0);
        expect(from).toBe(0);
        expect(limit).toBe(0);

        expect(message).toBe(i18next.t('PROJECT.SERVICE.ERROR.CREATE_LIST'));
    });
});
